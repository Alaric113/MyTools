import { M as MapContainer } from "./MapContainer-CMOpiwtN.js";
import { _ as _export_sfc, c as createElementBlock, b as createBaseVNode, d as createVNode, o as openBlock } from "./index-CeQXB7Tq.js";
const _hoisted_1 = { class: "finder-container" };
const _sfc_main = {
  __name: "ParkingFinder",
  setup(__props) {
    const handleBack = () => {
      window.history.back();
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", { class: "header" }, [
          createBaseVNode("button", {
            class: "back-button",
            onClick: handleBack
          }, _cache[0] || (_cache[0] = [
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
          _cache[1] || (_cache[1] = createBaseVNode("h1", null, "台北市路邊即時停車位", -1))
        ]),
        createVNode(MapContainer)
      ]);
    };
  }
};
const ParkingFinder = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-711651b7"]]);
export {
  ParkingFinder as default
};
