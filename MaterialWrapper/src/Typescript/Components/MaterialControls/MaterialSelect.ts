import { MaterialControl } from "./MaterialControl";
import { MaterialTextbox } from "./MaterialTextbox";
import { Ajax } from "../../Ajax/Ajax";

export interface MaterialSelectOption {
    text: string;
    value?: string;
}



export interface MaterialSelectOptions {
    Container?: JQuery<HTMLElement>
    ID?: string;
    LabelText?: string;
    OptionValues?: MaterialSelectOption[];
    UseTextAsValue?: boolean
    FetchAPIEndPoint?: string,
    addFunction?: Function,
    Required?: boolean;
    OutputTransformFunction?: (val: any) => any;
    InputTransformFunction?: (val: any) => any;
    FirstValDefault?: boolean;
    NoSearchBar?: boolean;
    Disabled?: boolean;
    CloseOnChange?: boolean;
    //Events
    OnChange?: (option: MaterialSelectOption) => void;
    OnClose?: () => void;
    OnOpen?: () => void;
    KeepOpenOnSelect?: boolean;
}

export class MaterialSelect2 implements MaterialControl {
    public Options: MaterialSelectOptions;
    public Data: MaterialSelectOption[];

    //Fields
    private _mainContainer: JQuery<HTMLElement>;


    private _label: JQuery<HTMLElement>;

    //Upper select container
    private _selectedContainer: JQuery<HTMLElement>;
    private _placeholder: JQuery<HTMLElement>;




    //Content container
    private _contentContainer: JQuery<HTMLElement>;
    private _searchContainer: JQuery<HTMLElement>;
    private _searchBar: MaterialTextbox;
    private _contentUL: JQuery<HTMLElement>;
    private _AddButton: JQuery<HTMLElement>;



    private _isSearching: boolean;

    private _filterValue: string;

    constructor(options: MaterialSelectOptions = {}) {
        this.Options = options;



    }


    private Init(): void {

        this._mainContainer = $("<div class='ms2_mainContainer'></div>");

        this.Options.Container.append(this._mainContainer);

        if (this.Options.LabelText) {

            this.BuildLabel();
        }

        this.BuildSelectedContainer();
        this.BuildContent();

        this.SetData()

        this.BindEvents();
        if (this.Options.OptionValues) {
            this.PopulateDisplayList();
        }
        if (!this.GetVal()) {
            this.Val(this.GetValueOf(0))
        }

        this.RepopulateFromAjax();

    }

    //===============================================
    //=================Build Methods=================
    //===============================================

    private BuildLabel() {
        this._label = $("<label></label>");
        this._label.attr('id', this.Options.ID + "_Label");
        this._label.attr("for", this.Options.ID);
        this._label.addClass("ms2_Label")
        this._label.text(this.Options.LabelText);

        this._mainContainer.append(this._label);
    }

    private BuildSelectedContainer() {
        this._selectedContainer = $("<div class='ms2_selectedContainer'></div>");
        this._placeholder = $("<span class='ms2_placeholder'></span>");
        this._selectedContainer.append(this._placeholder);

        this._selectedContainer.append("<span class='ms2_selectionArrow fa fa-chevron-down'></span>");

        this._mainContainer.append(this._selectedContainer);
    }

    private BuildContent() {
        this._contentContainer = $("<div class='ms2_contentContainer'></div>");
        this._searchContainer = $("<div class='ms2_searchContainer'></div>");
        this._contentContainer.append(this._searchContainer);

        this._contentUL = $("<ul class='ms2_contentUl'></ul>");
        this._contentContainer.append(this._contentUL);

        this._mainContainer.append(this._contentContainer);

        this.BuildSearchBar();

    }

    private BuildSearchBar() {
        if (!this.Options.NoSearchBar) {

            let searchBarContainer = $("<div class='ms2_searchBarContainer'></div>")
            this._contentContainer.prepend(searchBarContainer);
            this._searchBar =new  MaterialTextbox({
                PlaceHolderText: "Search...",
                Prepend: true
            }).AddNew(searchBarContainer);

            if (this.Options.addFunction) {
                this.BuildAddButton(searchBarContainer);

                this._AddButton.on('click', () => {
                    this.Options.addFunction(this._searchBar.GetVal(), this);
                })

            }

            this._searchBar.Textbox.on('keyup', () => {
                this._filterValue = this._searchBar.GetVal();

                this.PopulateDisplayList();
            })

        }
    }

    private BuildAddButton(container: JQuery<HTMLElement>) {
        this._AddButton = $("<div class='ms2_addButton'>+</div>");
        container.append(this._AddButton);
    }

    private PopulateDisplayList(): void {
        this._contentUL.empty();



        for (var i = 0; i < this.Data.length; i++) {
            let option: MaterialSelectOption = this.Data[i];

            if (this._filterValue && !this.FilterApplies(option.text)) {
                continue;
            }

            let listItem = $("<li></li>");
            listItem.attr("ms2_val", this.Options.UseTextAsValue ? option.text : option.value);
            listItem.text(option.text);
            this._contentUL.append(listItem);
        }



        let clickableElements = this._contentContainer;

        clickableElements.pushStack(this._contentUL.children("li"));

        if (this._searchBar) {
            clickableElements.pushStack(this._searchBar.Textbox)
        }

        clickableElements.on("click", (e: JQueryEventObject) => {
            this.BindOpenCloseEvents(e);
        });

        this._contentUL.children("li").on("click", (e: JQueryEventObject) => {
            this.Val($(e.target).attr("ms2_val"));
            if (!this.Options.KeepOpenOnSelect) {
                this.Close();
            }
        })

    }

    //===============================================
    //===============================================
    //===============================================



    //======================================================
    //==================Population Methods==================
    //======================================================

    private _valOnSearchComplete: any;
    public RepopulateFromAjax(onComplete?: () => void) {

        if (this.Options.FetchAPIEndPoint) {
            this._isSearching = true;
            new Ajax({
                EndPoint: this.Options.FetchAPIEndPoint,
                Data: JSON.stringify(""),
                Success: (data: MaterialSelectOption[]) => {

                    this.SetData(data);
                    this.PopulateDisplayList();

                    this._isSearching = false;
                    if (this._valOnSearchComplete) {
                        this.SetVal(this._valOnSearchComplete);
                    }

                    if (onComplete) {
                        onComplete();
                    }


                }
            }).Execute();
        }


    }


    //======================================================
    //======================================================
    //======================================================

    //================================================================
    //================Material Control implementations================
    //================================================================


    public AddNew(container: JQuery<HTMLElement>): MaterialSelect2 {
        this.Options.Container = container;
        this.Init();

        return this;

    }



    public CheckDisabled(): boolean {
        return this.Options.Disabled;
    }

    public Disable(): void {
        this.Options.Disabled = true;

    }

    public GetVal() {
        return this.OutputTransFormFunction(this._placeholder.attr("ms2_val"));
    }
    public SetVal(val: any) {
        val = this.InputTransFormFunction(val);

        this.Val(val);

    }



    public InputTransFormFunction(val: any) {

        if (this.Options.InputTransformFunction) {
            val = this.Options.InputTransformFunction(val);
        }

        return val;
    }

    public OutputTransFormFunction(val: any) {

        if (this.Options.OutputTransformFunction) {
            val = this.Options.OutputTransformFunction(val);
        }

        return val;
    }

    public IsValid(): boolean {
        let isValid = true;
        if (this.Options.Required && !this.GetVal()) {
            isValid = false;
        }

        return isValid;
    }

    public Destroy(): void {
        this.Options.Container.empty();
    }


    //================================================================
    //================================================================
    //================================================================


    public GetValueOf(index: number): any {
        return this._contentUL.children("li").eq(index).attr("ms2_val");
    }


    //================================================
    //=================Event Bindings=================
    //================================================
    private openOccured: boolean;
    public BindEvents() {
        $(document).on("click", (e: JQueryEventObject) => {

            if (this._mainContainer.hasClass("ms2_Open") && !this._mainContainer[0].contains(e.target[0])) {
                if (!this.openOccured) {
                    this.Close();
                } else {
                    this.openOccured = false;
                }
            }
        });



        this._mainContainer
            .on('click', (e: JQueryEventObject) => {
                this.BindOpenCloseEvents(e);
            });
    }

    public BindOpenCloseEvents(e: JQueryEventObject) {
        if (this._mainContainer.hasClass('ms2_Open')) {
            this.Close();
            this.openOccured = false;
        } else {
            if (!this.Options.Disabled) {
                this.Open();
                this.openOccured = true;
            }
        }
    }



    //================================================
    //================================================
    //================================================





    //==========================================
    //================= Events =================
    //==========================================


    private OnOpen() {
        if (this.Options.OnOpen) {
            this.Options.OnOpen();
        }
    }

    private OnClose() {
        if (this.Options.OnClose) {
            this.Options.OnClose();
        }
    }

    private OnChange(option: MaterialSelectOption) {
        if (this.Options.OnChange) {
            this.Options.OnChange(option);
        }
    }


    //==========================================
    //==========================================
    //==========================================

    //============================================
    //============== Filter Methods ==============
    //============================================

    private FilterApplies(val: string): boolean {
        return val.toLowerCase().indexOf(this._filterValue.toLowerCase()) > -1
    }


    //============================================
    //============================================
    //============================================


    public Open() {

        this._mainContainer.addClass("ms2_Open");
        this.OnOpen();
    }

    public Close() {
        this._mainContainer.removeClass("ms2_Open");
        this.OnClose();
    }

    public SetData(options?: MaterialSelectOption[]) {

        this.Data = [];

        if (this.Options.OptionValues) {
            this.Options.OptionValues.forEach((val) => {
                this.Data.push(val);
            })
        }

        if (options) {
            options.forEach((val) => {
                this.Data.push(val);
            })

        }
    }

    public Val(val: any) {
        let searchVal = "-1";
        if (val) {
            searchVal = this.InputTransFormFunction(val) as string;
        }


        let listItem = this._contentUL.children("[ms2_val=" + (searchVal).toString() + "]");

        let option: MaterialSelectOption = {
            value: listItem.attr("ms2_val"),
            text: listItem.text()
        }

        this._placeholder.attr("ms2_val", option.value);
        this._placeholder.text(option.text);

        if (this._isSearching) {
            this._valOnSearchComplete = val;
        } else {
            this.OnChange(option);
        }
    }

    public ValAsNumber() {

        let val = this.GetVal();
        if (!val) {
            return NaN
        }

        let vals = val.toString();



        return parseInt(vals);
    }


}