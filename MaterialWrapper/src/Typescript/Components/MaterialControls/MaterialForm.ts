import { GuidUtils } from "../../Utils/GUIDUtils";
import { MaterialControl, MaterialElement, MaterialInput, MaterialContainerOptions } from "./MaterialControl";

export interface MaterialFormOptions extends MaterialContainerOptions {
    IsCard?: boolean;
    Title?: string;
}


export class MaterialForm implements MaterialElement {

    public Options: MaterialFormOptions;

    public Form: JQuery<HTMLElement>;

    constructor(options: MaterialFormOptions = {}) {
        this.Options = options;

        if (!this.Options.controls) {
            this.Options.controls = [];
        }

        if (!this.Options.ID) {
            this.Options.ID = GuidUtils.GenerateUUID();
        }

        if (!this.Options.ClassesToAdd) {
            this.Options.ClassesToAdd = [];
        }

    }

    public AddNew(container: JQuery<HTMLElement>): MaterialForm {
        this.Options.Container = container;

        this.BuildForm();
        this.BuildTitle();
        container.append(this.Form);

        this.Options.controls.forEach((control: MaterialControl) => {

            control.AddNew(this.Form);
        })

        return this;
    }

    private BuildForm() {

        if (this.Options.IsCard) {
            this.Options.ClassesToAdd.push('mdc-card');
        }

        this.Form = $("<form id='" + this.Options.ID + "' class='mf_Form'></form>");

        if (this.Options.ClassesToAdd) {
            this.Form.addClass(this.Options.ClassesToAdd);
        }
    }

    private BuildTitle() {
        if (this.Options.Title) {
            this.Form.append("<div class='mf_Title'><span>"+this.Options.Title+"</span></div>")
        }
    }

    public IsValid(): boolean {
        let isValid: boolean = true;
        this.Options.controls.forEach((control: MaterialControl) => {
            
            let input = control as MaterialInput
            if (input.IsValid) {
                if (!input.IsValid()) {
                    isValid = false;
                }
            }
        })

        return isValid;
    }


}
