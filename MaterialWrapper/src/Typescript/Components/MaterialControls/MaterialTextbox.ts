import { MaterialInput, MaterialElementOptionsBase, MaterialInputOptionsBase } from "./MaterialControl";
import { MaterialElementBase } from "./MaterialElementBase";
import { Constants } from "../../Constants";
import { MDCTextField } from "@material/textfield";

export interface MaterialTextboxOptions extends MaterialInputOptionsBase {
    LabelText?: string;
    Type?: "text" | "number" | "password";
    PlaceHolderText?: string;
    Prepend?: boolean;
    Variant?: "Filled" | "Outlined",
    CustomValidators?: CustomeValidator[];
}

export interface CustomeValidator {
    Function: (val: any) => boolean;
    InvalidText:string;
}

export class MaterialTextbox extends MaterialElementBase implements MaterialInput {

    public Options: MaterialTextboxOptions;

    public MainContainer: JQuery<HTMLElement>;
    public FieldContainer: JQuery<HTMLElement>;
    public Textbox: JQuery<HTMLElement>;
    public Label: JQuery<HTMLElement>;
    public LineRipple: JQuery<HTMLElement>;
    public ErrorContainer: JQuery<HTMLElement>;

    public instance: MDCTextField;

    constructor(options: MaterialTextboxOptions) {
        super();

        this.Options = options;

        this.Options.ID = this.SetID(this.Options.ID);

        

        if (!this.Options.Type) {
            this.Options.Type = "text";
        }

        if (!this.Options.Variant) {
            this.Options.Variant = "Outlined";
        }

    }

    public AddNew(container: JQuery<HTMLElement>): MaterialTextbox {
        this.BuildMainContainer();
        this.BuildFieldContainer();
        this.BuildTextbox();
        this.BuildLabel();

        if (this.Options.Variant != "Outlined") {
            this.BuildLineRipple();
        }

        this.BuildErrorContainer();

        if (this.instance) {
            this.instance.destroy();
        }
        this.instance = new MDCTextField(this.FieldContainer[0]);

        if (this.Options.Prepend) {
            container.prepend(this.MainContainer);
        } else {
            container.append(this.MainContainer);
        }


        return this;

    }

    private BuildMainContainer() {
        this.MainContainer = $("<div class='mtxt_MainContainer '></div>");
    }

    private BuildFieldContainer() {
        let outlinedClass =this.Options.Variant =="Outlined"?"mdc-text-field--outlined": "";
        this.FieldContainer = $("<div class='mtxt_FieldContainer mdc-text-field " + outlinedClass + "'></div>");
        this.MainContainer.append(this.FieldContainer);
    }

    private BuildLabel() {
        if (this.Options.LabelText) {
            switch (this.Options.Variant) {
                case "Outlined":
                    this.BuildOutlineLabel();
                    break;
                case "Filled":
                    this.BuildFilledLabel();
                    break;
                default:
            }
            this.FieldContainer.append(this.Label);
        }
    }

    private BuildOutlineLabel() {
        this.Label = $("<div class='mdc-notched-outline'></div>");
        this.Label.append($("<div class='mdc-notched-outline__leading'></div>"));

        let labelInner = $("<div class=mdc-notched-outline__notch></div>");
        labelInner.append($("<label for='" + this.Options.ID + "'  class='mdc-floating-label'>" + this.Options.LabelText + "</label>"));
        this.Label.append(labelInner);

        this.Label.append($("<div class='mdc-notched-outline__trailing'></div>"));

    }

    private BuildFilledLabel() {
        this.Label = $("<label for='" + this.Options.ID + "' class='mtxt_Label mdc-floating-label'>" + this.Options.LabelText + "</label>");
    }



    private BuildTextbox() {
        this.Textbox = $("<input type='" + this.Options.Type + "' id='" + this.Options.ID + "' class=' mtxt_Textbox mdc-text-field__input'/>");
        if (this.Options.PlaceHolderText) {
            this.Textbox.attr('placeholder', this.Options.PlaceHolderText);
        }

        if (this.Options.Required) {
            this.Textbox.attr("required", "true");
        }



        this.FieldContainer.append(this.Textbox);
    }

    private BuildLineRipple() {
        this.LineRipple = $("<div class='mdc-line-ripple'></div>");
        this.FieldContainer.append(this.LineRipple);
    }

    private BuildErrorContainer() {
        this.ErrorContainer = $("<div class='mec_ErrorContainer'></div>");
        this.MainContainer.append(this.ErrorContainer);
    }


    public IsValid(): boolean {



        this.ErrorContainer.empty();

        let currentVal = this.GetVal();
        let errors: string[] = [];
        let isValid: boolean = true;

        if (this.Options.Required && (!this.GetVal() || this.GetVal() == "")) {
            errors.push(Constants.DataEmptyError);
        }

        if (!this.Options.CustomValidators) {
            this.Options.CustomValidators = [];
        }


        this.Options.CustomValidators.forEach((validator: CustomeValidator) => {
            if (!validator.Function(currentVal)) {
                errors.push(validator.InvalidText);
            }
        })

        if (errors.length > 0) {
            isValid = false;
            errors.forEach((error: string) => {
                this.ErrorContainer.append($("<div>" + error + "</div>"));
            })
        }

        return isValid;


    }


    public GetVal(): any {
        return this.OutputTransformFunction(this.Textbox.val());
    }

    public OutputTransformFunction(val: any): any {
        if (this.Options.OutputTransformFunction) {
            return this.Options.OutputTransformFunction(val);
        }
        return val;
    }

    public SetVal(val: any) {
        this.Textbox.val(this.InputTransformFunction(val));
        
        this.instance.focus();
    }
    public InputTransformFunction(val: any): any {
        if (this.Options.InputTransformFunction) {
            return this.Options.InputTransformFunction(val);
        }
        return val;
    }

    //===========================================
    //==============Utility Methods==============
    //===========================================

    public static GetRequiredMaterialTextbox(options: MaterialTextboxOptions): MaterialTextbox {
        options.Required = true;
        return new MaterialTextbox(options);
    }


    //===========================================
    //===========================================
    //===========================================

}