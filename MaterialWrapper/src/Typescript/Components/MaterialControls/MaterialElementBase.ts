import { GuidUtils } from "../../Utils/GUIDUtils";


export class MaterialElementBase {



    protected SetID(ID?: string) {
        if (!ID) {
            return GuidUtils.GenerateUUID();
        }
        return ID;
    }
}