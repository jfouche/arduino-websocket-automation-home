var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../application/typings/webcomponents.d.ts" />
var XFooElement = (function (_super) {
    __extends(XFooElement, _super);
    function XFooElement() {
        console.log("XFooElement");
        _super.call(this);
        if (module.hot) {
            module.hot.accept();
        }
    }
    XFooElement.prototype.attachedCallback = function () {
        console.log("attachedCallback");
    };
    XFooElement.prototype.createdCallback = function () {
        console.log("createdCallback");
    };
    return XFooElement;
}(HTMLElement));
var XFoo = document.registerElement('x-foo', XFooElement);
