import { MaterialElementBase } from "./MaterialElementBase";
import { MaterialInput, MaterialInputOptionsBase } from "./MaterialControl";
import { Constants } from "../../Constants";

export interface MaterialCheckboxOptions extends MaterialInputOptionsBase {
    Text?: string;
}

export class MaterialCheckbox extends MaterialElementBase implements MaterialInput {
    

    public Options: MaterialCheckboxOptions;

    public MainContainer: JQuery<HTMLElement>;
    public pTag: JQuery<HTMLElement>;
    public Label: JQuery<HTMLElement>;
    public Checkbox: JQuery<HTMLElement>;
    public Span: JQuery<HTMLElement>;
    public ErrorContainer: JQuery<HTMLElement>;

    constructor(options: MaterialCheckboxOptions) {
        super();

        this.Options = options;
        this.Options.ID = this.SetID(this.Options.ID);
    }

    public AddNew(container: JQuery<HTMLElement>) {
        this.MainContainer = $("<div class='mcbx_MainContainer'></div>");

        this.pTag = $("<p class='mcbx_PTag'></p>");
        this.MainContainer.append(this.pTag);

        this.Label = $("<label class='mcbx_Label'></label>");
        this.pTag.append(this.Label);

        this.Checkbox = $("<input type='checkbox' class='mcbx_Checkbox'/>");
        this.Label.append(this.Checkbox);

        this.Span = $("<span class='mcbx_Span'>" + (this.Options.Text || "") + "</span>");
        this.Label.append(this.Span);

        container.append(this.MainContainer);

        return this;

    }

    public Destroy() {
        this.MainContainer.remove();
    }

    public GetVal() {
        return this.OutputTransformFunction(this.Checkbox.prop("checked"));
    }

    public SetVal(val: any) {
        this.Checkbox.prop('checked', this.InputTransformFunction(val));
    }

    public InputTransformFunction(val:any) {
        if (this.Options.InputTransformFunction) {
            return this.Options.InputTransformFunction(val);
        }
        return val;
    }

    public OutputTransformFunction(val:any):any {
        if (this.Options.OutputTransformFunction) {
            return this.Options.OutputTransformFunction(val);
        }
        return val;
    }

    public IsValid():boolean {
        this.ErrorContainer.empty();

        let errors: string[] = [];
        let isValid: boolean = true;

        if (this.Options.Required && !this.GetVal()) {
            errors.push(Constants.DataEmptyError);
        }

        if (errors.length > 0) {
            isValid = false;
            errors.forEach((error: string) => {
                this.ErrorContainer.append($("<div>" + error + "</div>"));
            })
        }

        return isValid;

    }

}