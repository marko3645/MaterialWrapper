import { MaterialElementBase } from "./MaterialElementBase";
import { MaterialElement, MaterialElementOptionsBase } from "./MaterialControl";
import { MDCLinearProgress } from '@material/linear-progress';

export interface MaterialPreloaderOptions extends MaterialElementOptionsBase{
    Type?: "Indeterminate"|"Determinate";
    Prepend?: boolean;

}

export class MaterialPreloader extends MaterialElementBase implements MaterialElement {

    public Options: MaterialPreloaderOptions;

    public MainContainer: JQuery<HTMLElement>;

    public Instance: MDCLinearProgress;

    constructor(options: MaterialPreloaderOptions = {}) {
        super();
        this.Options = options;

        if (!this.Options.Type) {
            this.Options.Type = "Indeterminate";
        }

        this.Options.ID = this.SetID(this.Options.ID);

    }

    public AddNew(container:JQuery<HTMLElement>): MaterialPreloader {

        this.BuildElement();

        if (this.Options.Prepend) {
            container.prepend(this.MainContainer);
        } else {
            container.append(this.MainContainer);
        }

        return this;

    }

    public BuildElement():MaterialPreloader {
        this.MainContainer = $("<div role='progressbar' class='mpl_MainContainer mdc-linear-progress'></div>");
        this.MainContainer.append("<div class='mdc-linear-progress__buffering-dots'></div>");
        this.MainContainer.append("<div class='mdc-linear-progress__buffer'></div>");

        let primaryBar = $("<div class='mdc-linear-progress__bar mdc-linear-progress__primary-bar'></div>");
        primaryBar.append("<span class='mdc-linear-progress__bar-inner'></span>");

        this.MainContainer.append(primaryBar);
        

        this.Instance = new MDCLinearProgress(this.MainContainer[0]);

        switch (this.Options.Type) {

            case "Indeterminate":
                this.Instance.determinate = false;
            case "Determinate":
                this.Instance.determinate = true;
            default:
                this.Instance.determinate = false;
        }

        return this;
    }

    public Destroy() {
        this.Instance.destroy();
        this.MainContainer.remove();
    }


    public Start() {
        //this.MainContainer.show();
        this.Instance.open();
    }

    public Stop() {
        //this.MainContainer.hide();
        this.Instance.close();
    }

}