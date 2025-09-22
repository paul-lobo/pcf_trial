import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class SampleControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private sliderNotifyOutputChange : () => void;
    private sliderContainer : HTMLDivElement;
    private sliderControl : HTMLInputElement;
    private sliderLabel : HTMLLabelElement;
    private controlValue = "0";

    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.sliderNotifyOutputChange = notifyOutputChanged;
        this.sliderContainer = container;

        this.sliderControl = document.createElement("input");
        this.sliderControl.type = "range";
        this.sliderControl.min = "0";
        this.sliderControl.max = "200";
        this.sliderControl.value = context.parameters.dnlbslider?.raw?.toString() || "0";
        this.sliderControl.classList.add("custom-slider");


        this.sliderLabel = document.createElement("label");
        this.sliderLabel.textContent = `Value : ${this.sliderControl.value}`;
        this.sliderLabel.style.display = "block";
        this.sliderLabel.style.textAlign = "center";
        this.sliderLabel.classList.add("custom-slider-label");

        this.sliderContainer.appendChild(this.sliderControl);
        this.sliderContainer.appendChild(this.sliderLabel);
        
        this.sliderControl.addEventListener("input", (event:Event) => {
            const value = (event.target as HTMLInputElement).value;
            this.controlValue = value.toString();
            this.sliderLabel.textContent = `Value : ${value}`;
            this.sliderNotifyOutputChange();
        });
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
        const newValue = context.parameters.dnlbslider?.raw?.toString();
        if(newValue && typeof newValue === `string` ){
            if(this.controlValue !== '0'){
                return;
            }
            this.controlValue = "0";
        }else{
            if(newValue?.toString() != this.controlValue){
                this.controlValue = newValue?.toString() || "0";
            }
        }
        this.sliderControl.value = this.controlValue;
        this.sliderLabel.textContent = `Value : ${this.controlValue}`;

    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        const outputValue = parseInt(this.controlValue) || 0;
        return {dnlbslider: outputValue};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
        this.sliderContainer.removeChild(this.sliderControl);
        this.sliderContainer.removeChild(this.sliderLabel);
    }
}
