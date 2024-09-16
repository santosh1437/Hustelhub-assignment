import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'hustelhub-assignment';

  advanceRentForm:any =  FormGroup;
  generatedJSON: any ;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.advanceRentForm = this.fb.group({
      hasAdvRent: [false, Validators.required],
      advanceRentMonths: [{ value: '', disabled: true }, Validators.required],
      advanceRentAmount: [{ value: '', disabled: true }, Validators.required],
      isadvanceRentIncGST: [{ value: false, disabled: true }],
      isadvanceRentNotContinuous: [{ value: false, disabled: true }],
      advanceRentDetails: this.fb.array([])
    });

    this.onHasAdvRentChange();
  }

  onHasAdvRentChange() {
    this.advanceRentForm.get('hasAdvRent').valueChanges.subscribe((hasAdvRent: boolean) => {
      if (hasAdvRent) {
        this.enableAdvanceRentFields();
      } else {
        this.disableAdvanceRentFields();
      }
    });
  }

  enableAdvanceRentFields() {
    this.advanceRentForm.get('advanceRentMonths').enable();
    this.advanceRentForm.get('advanceRentAmount').enable();
    this.advanceRentForm.get('isadvanceRentIncGST').enable();
    this.advanceRentForm.get('isadvanceRentNotContinuous').enable();

    this.onAdvanceRentMonthsChange();
    this.onIsAdvanceRentNotContinuousChange();
  }

  disableAdvanceRentFields() {
    this.advanceRentForm.get('advanceRentMonths').disable();
    this.advanceRentForm.get('advanceRentAmount').disable();
    this.advanceRentForm.get('isadvanceRentIncGST').disable();
    this.advanceRentForm.get('isadvanceRentNotContinuous').disable();
    this.clearAdvanceRentDetails();
  }

  onAdvanceRentMonthsChange() {
    this.advanceRentForm.get('advanceRentMonths').valueChanges.subscribe((months: number) => {
      this.updateRentDetails(months);
    });
  }

  onIsAdvanceRentNotContinuousChange() {
    this.advanceRentForm.get('isadvanceRentNotContinuous').valueChanges.subscribe((isNotContinuous: boolean) => {
      if (isNotContinuous) {
        this.populateAdvanceRentDetails();
      } else {
        this.clearAdvanceRentDetails();
      }
    });
  }

  get advanceRentDetails() {
    return this.advanceRentForm.get('advanceRentDetails') as FormArray;
  }

  updateRentDetails(months: number) {
    this.clearAdvanceRentDetails();
    for (let i = 0; i < months; i++) {
      this.addRentDetail();
    }
  }

  addRentDetail() {
    this.advanceRentDetails.push(this.fb.group({
      date: ['', Validators.required],
      rentAmount: ['', Validators.required]
    }));
  }

  clearAdvanceRentDetails() {
    while (this.advanceRentDetails.length) {
      this.advanceRentDetails.removeAt(0);
    }
  }

  populateAdvanceRentDetails() {
    const months = this.advanceRentForm.get('advanceRentMonths').value;
    const amountPerMonth = this.advanceRentForm.get('advanceRentAmount').value / months;

    this.advanceRentDetails.controls.forEach((control:any, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() + index); 
      control.get('date').setValue(date.toISOString().split('T')[0]);
      control.get('rentAmount').setValue(amountPerMonth);
    });
  }

  onSubmit() {
    if (this.advanceRentForm.valid) {
      console.log(this.advanceRentForm.value);

      const formValue = this.advanceRentForm.value;
      this.generatedJSON = {
        hasAdvRent: formValue.hasAdvRent,
        advanceRentMonths: formValue.advanceRentMonths,
        advanceRentAmount: formValue.advanceRentAmount,
        isadvanceRentIncGST: formValue.isadvanceRentIncGST,
        isadvanceRentNotContinuous: formValue.isadvanceRentNotContinuous,
        advanceRentDetails: formValue.advanceRentDetails
      };
      console.log('Generated JSON:', this.generatedJSON);
    }
  }

  closeForm() {
    this.advanceRentForm.reset();
    this.advanceRentForm.markAsPristine();
    this.generatedJSON = '';
  }
}
