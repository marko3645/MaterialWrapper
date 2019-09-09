

export interface MaterialElementOptionsBase{
    ID?:string
    Container?: JQuery<HTMLElement>;
    ClassesToAdd?: string[];
}

export interface MaterialInputOptionsBase extends MaterialElementOptionsBase {
    Required?: boolean;
    InputTransformFunction?: (val: any) => any;
    OutputTransformFunction?: (val: any) => any;
}

export interface MaterialContainerOptions extends MaterialElementOptionsBase {
    controls?: MaterialControl[]
}




export interface MaterialElement {
    AddNew:(contaienr:JQuery<HTMLElement>)=> MaterialElement;
    Destroy?:()=>void
}

export interface MaterialControl extends MaterialElement{
}

export interface MaterialInput extends MaterialControl{

    GetVal():any;
    SetVal(val:any);
    InputTransformFunction:(val:any)=>any;
    OutputTransformFunction:(val:any)=>any;
    IsValid: () => boolean;
    
}


