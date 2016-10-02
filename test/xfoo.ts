/// <reference path="../application/typings/webcomponents.d.ts" />
declare var module: any;

class XFooElement extends HTMLElement {
    constructor() {
        console.log("XFooElement");
        super();
        if (module.hot) {
            module.hot.accept()
        }
    }

    attachedCallback() {
        console.log("attachedCallback");
    }

    createdCallback() {
        console.log("createdCallback");
    }
}

let XFoo = document.registerElement('x-foo', XFooElement);