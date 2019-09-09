import { MaterialControl, MaterialElementOptionsBase } from "./MaterialControl";
import { MaterialElementBase } from "./MaterialElementBase";
import { MaterialPreloaderOptions, MaterialPreloader } from "./MaterialPreloader";
import { MDCRipple } from '@material/ripple';
export interface MaterialButtonOptions extends MaterialElementOptionsBase {
    Text?: string;
    preloaderOptions?: MaterialButtonPreloaderOptions;
    Variant?: "raised" | "unelevated" | "outlined";

}

export interface MaterialButtonPreloaderOptions extends MaterialPreloaderOptions {
    Position?: "left" | "right" | "top" | "bottom";
}


export class MaterialButton extends MaterialElementBase implements MaterialControl {

    public Options: MaterialButtonOptions;


    public Button: JQuery<HTMLElement>;
    public MainContainer: JQuery<HTMLElement>;
    public Preloader: MaterialPreloader;

    constructor(options: MaterialButtonOptions = {}) {
        super();
        this.Options = options;

        this.Options.ID = this.SetID(this.Options.ID);

    }

    public AddNew(container: JQuery<HTMLElement>): MaterialButton {
        this.BuildMainContainer();
        this.BuildButton();
        this.AddRipple();
        this.BuildPreloader();
        container.append(this.MainContainer);

        return this;
    }

    public Destroy() {
        this.MainContainer.remove();
    }

    private BuildMainContainer() {
        this.MainContainer = $("<div class='mbtn_MainContainer'></div>");
    }

    private BuildButton() {

        
        let variant = "mdc-button--" + (this.Options.Variant?this.Options.Variant: "unelevated");

        

        this.Button = $("<button type='button' id='" + this.Options.ID + "' class='mbtn_Button  mdc-button  " + variant + " '><span class='mdc-button__label'>" + this.Options.Text + "</span></button>");
        this.MainContainer.append(this.Button);

    }

    private AddRipple() {
        const buttonRipple = new MDCRipple(this.Button[0]);
    }

    private BuildPreloader() {
        if (this.Options.preloaderOptions) {


            this.Preloader = new MaterialPreloader({
                Type: this.Options.preloaderOptions.Type
            })
            this.Preloader.BuildElement();


            if (!this.Options.preloaderOptions.Position) {
                this.Options.preloaderOptions.Position = "top";
            }



            switch (this.Options.preloaderOptions.Position) {
                case "top":
                case "left":
                        this.Preloader.MainContainer.insertBefore(this.Button);
                    break;
                case "right":
                case "bottom":
                        this.Preloader.MainContainer.insertAfter(this.Button);
                    break;
            }
            if (this.Options.preloaderOptions.Position == "bottom" || this.Options.preloaderOptions == "top") {
                this.MainContainer.addClass('topBottomPreloader');
                this.MainContainer.remove('leftRightPreloader');
            } else {
                this.MainContainer.removeClass('topBottomPreloader');
                this.MainContainer.addClass('leftRightPreloader');
            }
            this.Preloader.Stop();

        } else {
            this.Options.preloaderOptions = {
                Position: "top",
                Type: "Indeterminate"
            }
            this.BuildPreloader();
        }
    }

    public StartLoad() {
        this.Preloader.MainContainer.show();
        this.Preloader.Start();
    }

    public StopLoad() {
        this.Preloader.MainContainer.hide();
        this.Preloader.Stop();
    }



}