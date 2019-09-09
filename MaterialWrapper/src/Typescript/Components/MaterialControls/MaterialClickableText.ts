import { MaterialControl, MaterialElementOptionsBase } from "./MaterialControl";
import { MaterialElementBase } from "./MaterialElementBase";

export interface MaterialClickableTextOptions extends MaterialElementOptionsBase {
    Text?: string;
}

export class MaterialClickableText extends MaterialElementBase implements MaterialControl {

    public Options: MaterialClickableTextOptions;
    public Element: JQuery<HTMLElement>;

    constructor(options: MaterialClickableTextOptions) {
        super();

        this.Options = options;

        this.Options.ID = this.SetID(this.Options.ID);

    }

    public AddNew(container: JQuery<HTMLElement>): MaterialClickableText {
        this.Element = $("<span class='mct_Element'>" + (this.Options.Text ? this.Options.Text : "") + "</span>");
        container.append(this.Element);

        return this;
    }

    public Destroy() {
        this.Element.remove();
    }

}