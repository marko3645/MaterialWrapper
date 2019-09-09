export enum KeyboardKey {
    Enter = 13
}


export class KeyboardUtils {
    public static OnPress(key: KeyboardKey, handler, element?: JQuery<HTMLElement>, stopPropogation?:boolean) {

       

        let keyPressFunction = (function (e: JQuery.KeyPressEvent) {
            if (e.which == key) {
                handler(e);
                if (stopPropogation) {
                    e.stopPropagation();
                }
            }
        })

        if (!element) {
            $(document).keypress(keyPressFunction);
        } else {
            element.keypress(keyPressFunction);
        }

        
    }
}