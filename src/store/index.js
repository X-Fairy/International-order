import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        // 购物车数据
        headerCartData: {
            list: [],
            listNum: 0,
            cartTypeCate: [],
            copyTableData: [],
            cascaderData: [],   //  级联数据
            num: 0,
            pageNum: 0,         // 购物车总分页数
            listPrice: 0,       // 购物车商品总金额
            partPrice: 0,       // 购物车当前仓、当前商品类、当前分页金额
            typeNum: 0,         // 购物车商品款数
        },  
        presellNum: 0,          // 已拍预售商品件数
    },
    getters: {
        // 商品总金额
        totalPrice(state) {
            let price = 0;
            state.headerCartData.copyTableData.forEach(item => {
                price += Number(item.num) * Number(item.price);
            });
            return price.toFixed(2);
        },
        // 共几件商品结算
        cartNum(state) {
            let cartnum = 0;
            state.headerCartData.copyTableData.forEach(item => {
                cartnum += Number(item.num);
            })
            return cartnum;
        },
        num(state) {
            return state.headerCartData.num;
        },
        pageNum(state) {
            return state.headerCartData.pageNum;
        },
        // 购物车商品总金额
        listPrice(state) {
            return state.headerCartData.listPrice;
        },
        // 购物车当前仓、当前商品类、当前分页金额
        partPrice(state) {
            return state.headerCartData.partPrice;
        },
        listNum(state) {
            return state.headerCartData.listNum;
        },
        // 购物车商品款数
        typeNum(state) {
            return state.headerCartData.typeNum;
        },
        presellNum(state) {
            return state.presellNum;
        }
    },
    mutations: {
        setCartData(state, params) {
            state.headerCartData = params;
        },
        setCartDataList(state, params) {
            params.forEach(item => {
                item._checked = false;
            });
            state.headerCartData.list = params;
        },
        setCartDataListNum(state, params) {
            state.headerCartData.listNum = params;
        },
        // 购物车商品总金额
        setTotalPrice(state, params) {
            state.headerCartData.listPrice = params;
        },
        // 购物车当前仓、当前商品类、当前分页金额
        setPartPrice(state, params) {
            state.headerCartData.partPrice = params;
        },
        setCartDataCartTypeCate(state, params) {
            state.headerCartData.cartTypeCate = params;
        },
        setCartCopyTableData(state, params) {
            state.headerCartData.copyTableData = params;
        },
        setCascaderData(state, params) {
            state.headerCartData.cascaderData = params;   //  级联数据
        },
        setPageNum(state, params) {
            state.headerCartData.pageNum = params;
        },
        setTypeNum(state, params) {
            state.headerCartData.typeNum = params;
        },
        setPresellNum(state, params) {
            state.presellNum = params;
        }
    },

    actions: {
        getDataCard({ commit }, {vm, inland,page,cls,keyword}) {
            let paramsObj;
            switch(Number(inland)) {
                case 1:
                    paramsObj = {
                        lang: localStorage.langSelect,  // 语言
                        inland: 1, // 1是国内，0是国外
                        page,// 购物车页码,
                        cls,// 商品分类
                        keyword,
                    }
                    break;
                case 0:
                    paramsObj = {
                        lang: localStorage.langSelect,
                        inland: 0, // 1是国内，0是国外
                        page,// 购物车页码,
                        cls,  // 商品分类
                        keyword,
                    }
                    break;
                default:
                    paramsObj = {
                        lang: localStorage.langSelect,
                        page,// 购物车页码,
                        cls,  // 商品分类
                        keyword,
                    }
                    break;
            }
            vm.$resetAjax({
                type: 'POST',
                url: `/Home/Cart/index`,
                data: paramsObj,
                success: (res) => {
                    let result = JSON.parse(res);
                    // 购物车商品总数
                    result.totle_num = result.totle_num ? result.totle_num : 0;
                    if(result.list.length === 0) {
                        // 购物车商品表格数据
                        commit('setCartDataList', []);
                        commit('setCartCopyTableData', []);
                        // 商品分类购物车
                        commit('setCartDataCartTypeCate', []); 
                        commit('setCartDataListNum', 0);
                        commit('setCascaderData', []);
                        commit('setPartPrice', 0)
                        commit('setTypeNum', 0) // 购物车商品款数
                        return false;
                    }
                    result.list.forEach(ele => {
                        ele.imgUrl = `https://ximiphoto.oss-cn-hangzhou.aliyuncs.com/thumb/${ele.item_no}.jpg?x-oss-process=style/80`;
                        ele.barCode = `http://order.xmvogue.com/word/public/index.php?s=home/Cart/barcode_create&sn=${ele.item_no}`;  // 商品条形码
                        ele.content = '';
                        ele.popcontent = '';
                        ele.lot_spec = ele.lot_spec ? ele.lot_spec : ele.spec;
                        ele.maxNum = ele.spec * 40 > ele.stock_num ?  ele.spec * 40 :ele.stock_num;
                        if(ele.ban_area === 1 && ele.display_flag === 0) {
                            // 说明该商品既下线又是禁配该地区的
                            ele.nosubmit = false;
                            switch(localStorage.langSelect) {
                                case "0":
                                    ele.nosubmitTips = '该商品下线且在该地区禁配';
                                    break;
                                case "1":
                                    ele.nosubmitTips = 'Discontinued item and is prohibited to sell in your region.';
                                    break;
                            }
                        } else if(ele.ban_area === 0 && ele.display_flag === 0) {
                            ele.nosubmit = false;
                            switch(localStorage.langSelect) {
                                case "0":
                                    ele.nosubmitTips = '该商品已下线';
                                    break;
                                case "1":
                                    ele.nosubmitTips = 'Discontinued item.';
                                    break;
                            }
                        } else if (ele.ban_area === 1 && ele.display_flag === 1) {
                            ele.nosubmit = false;
                            switch(localStorage.langSelect) {
                                case "0":
                                    ele.nosubmitTips = '该商品在该地区禁配';
                                    break;
                                case "1":
                                    ele.nosubmitTips = 'This item is prohibited to sell in your region.';
                                    break;
                            }
                        } else {
                            ele.nosubmit = true;
                            ele.nosubmitTips = '';
                        }
                        ele.shopDelIcon = false;
                    });
                    // 购物车商品表格数据
                    commit('setCartDataList', result.list);
                    // 购物车商品表格
                    commit('setCartCopyTableData', result.list.concat());
                    // 购物车当前地区商品总数量
                    commit('setCartDataListNum', result.spnum);
                    // 购物车总金额
                    commit('setPartPrice', Number((result.money)).toFixed(2));
                    commit('setCascaderData', result.cate);
                    // 购物车分类清单数据
                    let cateData = result.cate; 
                    // 商品分类购物车
                    // result.hd_list.forEach(ele => {
                    //     ele.title = ele.huodong_name;
                    //     cateData.push(ele)
                    // });
                    // 购物车商品款数
                    commit('setTypeNum', result.count ? Number(result.count) : 0);
                    commit('setCartDataCartTypeCate', cateData); 
                }
            })
        }, 
        /**
         *  得到购物车商品总数量、总金额、预售商品总订购数
         */
        getCartInfo({commit}, {vm}) {
            vm.$resetAjax({
                type: 'GET',
                url: `/home/cart/get_cart_num`,
                success: (res) => {
                    let result = JSON.parse(res).data;
                    // 购物车商品总数
                    commit('setPageNum', result.count ? Number(result.count) : 0);
                    // 购物车总金额
                    commit('setTotalPrice', Number((result.sum)).toFixed(2));
                    // 预售商品已拍商品款数
                    commit('setPresellNum',result.presell ? Number(result.presell) : 0);
                }
            })
            
        }
    }
});

export default store;