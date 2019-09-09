import { MaterialElement, MaterialContainerOptions, MaterialControl } from "./MaterialControl";
import { MaterialElementBase } from "./MaterialElementBase";



export class MaterialContainer extends MaterialElementBase implements MaterialElement {

    public Options: MaterialContainerOptions;

    public MainContainer: JQuery<HTMLElement>;

    constructor(options: MaterialContainerOptions) {
        super();
        this.Options = options;

        this.Options.ID = this.SetID(this.Options.ID);

    }

    public AddNew(container: JQuery<HTMLElement>): MaterialContainer {
        this.MainContainer = $("<div class='mc_MainContainer'></div>");

        if (this.Options.ClassesToAdd) {
            this.MainContainer.addClass(this.Options.ClassesToAdd);
        }

        if (this.Options.controls) {
            this.Options.controls.forEach((control: MaterialControl) => {
                control.AddNew(this.MainContainer);
            })
        }

        container.append(this.MainContainer);

        return this;


    }



    public Destroy(): void {

        if (this.Options.controls) {
            this.Options.controls.forEach((control: MaterialControl) => { control.Destroy() })
        }

        this.MainContainer.remove();


    }



}