import { s as services_minExports, M as MapContainer } from "./MapContainer-BXNKtuPf.js";
import { _ as _export_sfc, r as ref, o as oilPrices, c as createElementBlock, a as createCommentVNode, b as openBlock, d as createBaseVNode, t as toDisplayString, w as withDirectives, v as vShow, e as createVNode, f as oilPrice } from "./index-GYUwYyXx.js";
const _hoisted_1$2 = {
  key: 0,
  class: "route-info"
};
const _hoisted_2$2 = { class: "info-item" };
const _hoisted_3$1 = { class: "value" };
const _hoisted_4$1 = { class: "info-item" };
const _hoisted_5$1 = { class: "value" };
const _hoisted_6$1 = { class: "info-item" };
const _hoisted_7$1 = { class: "value" };
const _hoisted_8$1 = { class: "info-item" };
const _hoisted_9$1 = { class: "value" };
const API_KEY = "9EKBnyQjcyZBnee9HAOKrOXCxltu2htL";
const _sfc_main$2 = {
  __name: "RouteInfo",
  setup(__props, { expose: __expose }) {
    const distance = ref(null);
    const duration = ref(null);
    const fuelConsumption = ref(null);
    const totalPrice = ref(null);
    const p98 = oilPrices.value[0].參考牌價;
    console.log(p98);
    const calculateRoute = async (start, end) => {
      var _a;
      try {
        const response = await services_minExports.services.calculateRoute({
          key: API_KEY,
          locations: `${start.lng},${start.lat}:${end.lng},${end.lat}`,
          travelMode: "car",
          traffic: true,
          language: "zh-TW"
        });
        if (((_a = response.routes) == null ? void 0 : _a.length) > 0) {
          const route = response.routes[0];
          distance.value = (route.summary.lengthInMeters / 1e3).toFixed(1);
          duration.value = Math.round(route.summary.travelTimeInSeconds / 60);
          fuelConsumption.value = (route.summary.lengthInMeters / 1e3 / 7).toFixed(1);
          totalPrice.value = (fuelConsumption.value * p98).toFixed(1);
          return {
            success: true,
            route
          };
        }
        return false;
      } catch (error) {
        console.error("路線計算失敗:", error);
        throw error;
      }
    };
    __expose({ calculateRoute });
    return (_ctx, _cache) => {
      return distance.value ? (openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode("div", _hoisted_2$2, [
          _cache[0] || (_cache[0] = createBaseVNode("span", { class: "label" }, "距離:", -1)),
          createBaseVNode("span", _hoisted_3$1, toDisplayString(distance.value) + " km", 1)
        ]),
        createBaseVNode("div", _hoisted_4$1, [
          _cache[1] || (_cache[1] = createBaseVNode("span", { class: "label" }, "時間:", -1)),
          createBaseVNode("span", _hoisted_5$1, toDisplayString(duration.value) + " 分鐘", 1)
        ]),
        createBaseVNode("div", _hoisted_6$1, [
          _cache[2] || (_cache[2] = createBaseVNode("span", { class: "label" }, "預估油耗:", -1)),
          createBaseVNode("span", _hoisted_7$1, toDisplayString(fuelConsumption.value) + " 升", 1)
        ]),
        createBaseVNode("div", _hoisted_8$1, [
          _cache[3] || (_cache[3] = createBaseVNode("span", { class: "label" }, "預估價錢:", -1)),
          createBaseVNode("span", _hoisted_9$1, toDisplayString(totalPrice.value) + " 元 ", 1)
        ])
      ])) : createCommentVNode("", true);
    };
  }
};
const RouteInfo = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-04bb468e"]]);
const _hoisted_1$1 = { class: "floating-search-panel" };
const _hoisted_2$1 = { class: "search-group" };
const _hoisted_3 = ["value"];
const _hoisted_4 = { class: "search-group" };
const _hoisted_5 = ["value"];
const _hoisted_6 = {
  key: 0,
  class: "selection-hint"
};
const _hoisted_7 = { class: "button-group" };
const _hoisted_8 = ["disabled"];
const _hoisted_9 = { key: 0 };
const _hoisted_10 = { key: 1 };
const _hoisted_11 = ["disabled"];
const _sfc_main$1 = {
  __name: "SearchPanel",
  props: {
    startAddress: String,
    endAddress: String,
    activeInput: String,
    startPoint: Object,
    endPoint: Object,
    isLoading: Boolean
  },
  emits: [
    "update:activeInput",
    "update:hasRoute",
    "calculate",
    "clear"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const routeInfoRef = ref(null);
    const hasRoute = ref(false);
    const setActiveInput = (type) => {
      emit("update:activeInput", type);
    };
    const handleCalculate = async () => {
      if (!props.startPoint || !props.endPoint) return;
      emit("calculate", true);
      try {
        const success = await routeInfoRef.value.calculateRoute(
          props.startPoint,
          props.endPoint
        );
        if (success.success) {
          hasRoute.value = success;
          emit("update:hasRoute", success);
          emit("update:route", success.route);
        }
      } catch (error) {
        hasRoute.value = false;
        emit("update:hasRoute", false);
      } finally {
        emit("calculate", false);
      }
    };
    const handleClear = () => {
      hasRoute.value = false;
      emit("update:hasRoute", false);
      emit("clear");
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("div", _hoisted_2$1, [
          _cache[3] || (_cache[3] = createBaseVNode("label", null, "出發地:", -1)),
          createBaseVNode("input", {
            value: __props.startAddress,
            placeholder: "輸入或點擊地圖選擇",
            onFocus: _cache[0] || (_cache[0] = ($event) => setActiveInput("start"))
          }, null, 40, _hoisted_3)
        ]),
        createBaseVNode("div", _hoisted_4, [
          _cache[4] || (_cache[4] = createBaseVNode("label", null, "目的地:", -1)),
          createBaseVNode("input", {
            value: __props.endAddress,
            onFocus: _cache[1] || (_cache[1] = ($event) => setActiveInput("end")),
            placeholder: "輸入或點擊地圖選擇"
          }, null, 40, _hoisted_5)
        ]),
        __props.activeInput ? (openBlock(), createElementBlock("div", _hoisted_6, " 正在選擇" + toDisplayString(__props.activeInput === "start" ? "出發地" : "目的地") + " - 請點擊地圖 ", 1)) : createCommentVNode("", true),
        withDirectives(createVNode(RouteInfo, {
          ref_key: "routeInfoRef",
          ref: routeInfoRef,
          startPoint: __props.startPoint,
          endPoint: __props.endPoint,
          onCalculate: _cache[2] || (_cache[2] = ($event) => emit("calculate"))
        }, null, 8, ["startPoint", "endPoint"]), [
          [vShow, hasRoute.value]
        ]),
        createBaseVNode("div", _hoisted_7, [
          createBaseVNode("button", {
            class: "calculate-btn",
            onClick: handleCalculate,
            disabled: !__props.startPoint || !__props.endPoint || __props.isLoading
          }, [
            !__props.isLoading ? (openBlock(), createElementBlock("span", _hoisted_9, "計算路線")) : (openBlock(), createElementBlock("span", _hoisted_10, "計算中..."))
          ], 8, _hoisted_8),
          createBaseVNode("button", {
            class: "clear-btn",
            onClick: handleClear,
            disabled: !hasRoute.value
          }, " 清除路線 ", 8, _hoisted_11)
        ])
      ]);
    };
  }
};
const SearchPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-b1d38020"]]);
const _hoisted_1 = { class: "gas-price-container" };
const _hoisted_2 = { class: "header" };
const _sfc_main = {
  __name: "GasPrice",
  setup(__props) {
    const activeInput = ref(null);
    const startAddress = ref("");
    const endAddress = ref("");
    const startPoint = ref(null);
    const endPoint = ref(null);
    const isLoading = ref(false);
    const hasRoute = ref(false);
    const currentRoute = ref(null);
    const handleRouteUpdate = (route) => {
      currentRoute.value = route;
    };
    const handleCalculate = (isCalculating) => {
      isLoading.value = isCalculating;
    };
    const handleHasRouteUpdate = (value) => {
      hasRoute.value = value;
    };
    const handleBack = () => {
      window.history.back();
    };
    const handleClearRoute = (value) => {
      startAddress.value = "";
      endAddress.value = "";
      startPoint.value = null;
      endPoint.value = null;
      hasRoute.value = false;
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("button", {
            class: "back-button",
            onClick: handleBack
          }, _cache[8] || (_cache[8] = [
            createBaseVNode("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }, [
              createBaseVNode("line", {
                x1: "19",
                y1: "12",
                x2: "5",
                y2: "12"
              }),
              createBaseVNode("polyline", { points: "12 19 5 12 12 5" })
            ], -1)
          ])),
          _cache[9] || (_cache[9] = createBaseVNode("h1", null, "油耗計算", -1)),
          createVNode(oilPrice, { id: "oilPrice" })
        ]),
        createVNode(SearchPanel, {
          startAddress: startAddress.value,
          "onUpdate:startAddress": _cache[0] || (_cache[0] = ($event) => startAddress.value = $event),
          endAddress: endAddress.value,
          "onUpdate:endAddress": _cache[1] || (_cache[1] = ($event) => endAddress.value = $event),
          activeInput: activeInput.value,
          "onUpdate:activeInput": _cache[2] || (_cache[2] = ($event) => activeInput.value = $event),
          startPoint: startPoint.value,
          endPoint: endPoint.value,
          isLoading: isLoading.value,
          hasRoute: hasRoute.value,
          onCalculate: handleCalculate,
          "onUpdate:hasRoute": handleHasRouteUpdate,
          onClear: handleClearRoute,
          "onUpdate:route": handleRouteUpdate
        }, null, 8, ["startAddress", "endAddress", "activeInput", "startPoint", "endPoint", "isLoading", "hasRoute"]),
        createVNode(MapContainer, {
          route: currentRoute.value,
          activeInput: activeInput.value,
          "onUpdate:activeInput": _cache[3] || (_cache[3] = ($event) => activeInput.value = $event),
          startAddress: startAddress.value,
          "onUpdate:startAddress": _cache[4] || (_cache[4] = ($event) => startAddress.value = $event),
          endAddress: endAddress.value,
          "onUpdate:endAddress": _cache[5] || (_cache[5] = ($event) => endAddress.value = $event),
          startPoint: startPoint.value,
          "onUpdate:startPoint": _cache[6] || (_cache[6] = ($event) => startPoint.value = $event),
          endPoint: endPoint.value,
          "onUpdate:endPoint": _cache[7] || (_cache[7] = ($event) => endPoint.value = $event)
        }, null, 8, ["route", "activeInput", "startAddress", "endAddress", "startPoint", "endPoint"])
      ]);
    };
  }
};
const GasPrice = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ae549b0e"]]);
export {
  GasPrice as default
};
