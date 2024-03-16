import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, distinctUntilChanged, map, share, tap } from 'rxjs';
import { TKeysOf } from '../types/keys-of.type';

@Component({
  selector: 'ovo-abstract-base-form',
  template: '',
})
export abstract class AbstractBaseFormComponent<TFormValue extends Record<string, any>, TExternalValue> implements OnInit, OnDestroy, OnChanges {
  readonly requiredValidator = { validators: [Validators.required] };
  form!: FormGroup;
  protected _form!: FormGroup;
  valueChanges$$ = new BehaviorSubject<TExternalValue>({} as TExternalValue);
  valueChanges$ = this.valueChanges$$.asObservable().pipe(share());
  statusChanges$$ = new BehaviorSubject<boolean>(false);
  statusChanges$ = this.statusChanges$$.asObservable().pipe(share());
  private readonly subscriptions: Subscription[] = [];
  readonly input$$ = new BehaviorSubject<TExternalValue>({} as TExternalValue);
  private readonly input$ = this.input$$.asObservable().pipe(
    tap((_) => {
      if (this.debug) {
        this.outputDebug('input$ => ', _);
      }
    }),
    tap(() => this._form.markAllAsTouched()),
    share(),
  );
  @Input() debug!: boolean;
  @Input() input!: TExternalValue;
  @Output() valueChange = new EventEmitter<TExternalValue>();
  @Output() statusChange = new EventEmitter<boolean>();
  initTime!: number;
  elapsedTime!: number;

  ngOnChanges(changes: SimpleChanges): void {
    const updatedInput = changes['input'];
    if (updatedInput) {
      this.input$$.next(updatedInput.currentValue);
    }
  }

  ngOnDestroy(): void {

    if (this.debug) {
      this.outputDebug('unsubscribing from subscriptions')
    }

    if (this.subscriptions.length) {
      this.subscriptions.forEach(sub => {
        if (sub) {
          try {
            sub.unsubscribe();
          } catch (error: any) {
            if (this.debug) {
              this.outputDebug('error while unsubscribing from subscription', error)
            }
          }
        }
      });
    }
  }

  ngOnInit(): void {
    if (this.debug) {
      this.outputDebug('building form')
    }
    this.initTime = Date.now();
    this._form = this._buildForm();

    if (this.debug) {
      this.outputDebug('initially provided form controls => ', Object.keys(this._form?.controls || {}).join(', '));
    }

    if (this.debug) {
      this.outputDebug('registering subscriptions');
    }

    this.subscriptions.push(

      this.input$.pipe(
        tap(value => {
          const formValue = this._toFormValue(value);

          if (this.debug) {
            this.outputDebug(value, ' => transformed to form value => ', formValue)
          }

          this._configureForm(formValue);

          if (this.debug) {
            this.outputDebug('after configuring form controls => ', Object.keys(this._form?.controls || {}).join(', '));
          }

          const safeFormValue = this.removeKeysFromFormValueIfNoControlPresent(formValue);

          this._form.setValue(safeFormValue);
          setTimeout(() => {

            this._form.updateValueAndValidity({ onlySelf: true, emitEvent: true });

            if (!this.form) {
              if (this.debug) {
                this.elapsedTime = Date.now() - this.initTime;
                this.outputDebug(`making private form accessible to the view; ${this.elapsedTime/1000} seconds`)
              }
              this.form = this._form;
            }
          }, 0);
        })
      ).subscribe(),

      this._form.valueChanges.pipe(
        tap((formValue: TFormValue) => {
          if (this.debug) {
            this.outputDebug('value change => ', formValue);
          }
        }),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        tap(value => this.showErrors(value)),
        tap(formValue => {
          if (this.debug) {
            this.outputDebug('DISTINCT value change => ', formValue);
            this.outputDebug('configuring form');
          }

          this._configureForm(formValue);

          const externalValue = this._fromFormValue(formValue);

          if (this.debug) {
            this.outputDebug(formValue, ' => transformed to external value => ', externalValue);
          }

          this.valueChange.emit(externalValue);
          this.valueChanges$$.next(externalValue);
        }),
      ).subscribe(),

      this._form.statusChanges.pipe(
        map(status => status === 'VALID'),
        distinctUntilChanged(),
        tap(status => {
          if (this.debug) {
            this.outputDebug('form status change => ', status)
          }
        }),
        tap(status => this.statusChanges$$.next(status)),
        tap(status => this.statusChange.emit(status))
      ).subscribe(),

      ...this._getFieldLevelValueSubscriptions()
    );
  }

  protected requiredIf(predicate: () => boolean): ValidatorFn {
    const validator: ValidatorFn = (control: AbstractControl) => {
      if (predicate() && !control.value) {
        return { required: true };
      }
      return null;
    }

    return validator;
  };

  get value(): TFormValue {
    return this._form?.value || {};
  }

  showErrors(input: TFormValue) {
    const errors: any = {};
    Object.entries(this._form.controls).forEach(([name, control]) => {
      // control.setValue((input || {})[name]);
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();
      errors[name] = control.errors;
    });
    if(this.debug) {
      this.outputDebug(errors);
    }

    this._form.markAllAsTouched()
    // this._form.updateValueAndValidity()
  }

  abstract _getClassName(): string;
  abstract _buildForm(): FormGroup<{ [key in keyof TFormValue]: FormControl }>;
  abstract _configureForm(formValue: TFormValue): void;
  abstract _toFormValue(externalValue: TExternalValue): TFormValue;
  abstract _fromFormValue(formValue: TFormValue): TExternalValue;
  abstract _getFieldLevelValueSubscriptions(): Subscription[];

  protected outputDebug(...args: any[]) {
    console.warn(this._getClassName(), ...args);
  }

  protected valueChangesFor(controlName: keyof TFormValue): Observable<any> {
    try {
      return (this._form.controls as any)[controlName].valueChanges;
    } catch (error: any) {
      this.outputDebug('#valueChangesFor => error locating control', controlName);
      return new Observable();
    }
  }

  private removeKeysFromFormValueIfNoControlPresent<TFormValue extends Record<string, any>>(formValue: TFormValue) {
    const controlKeys = (Object.keys(this._form.controls));

    const returnValue: TFormValue = {} as any;

    controlKeys.forEach(key => {
      if (this.debug) {
        if (key in formValue) {
          this.outputDebug('removeKeysFromFormValueIfNoControlPresent form value present', key, formValue[key]);
        } else {
          this.outputDebug('removeKeysFromFormValueIfNoControlPresent form value missing', key);
        }
      }

      (returnValue as any)[key] = formValue[key] || null;
    });

    return returnValue;
  }

  protected configureFields(include: boolean, fields: Array<keyof TFormValue>, controls?: Partial<TKeysOf<TFormValue, FormControl>>, skipEmit = false) {
    return this._configureFields(include, fields, controls, skipEmit, false);
  }

  protected configureFieldsDryRun(include: boolean, fields: Array<keyof TFormValue>, controls?: Partial<TKeysOf<TFormValue, FormControl>>, skipEmit = false) {
    return this._configureFields(include, fields, controls, skipEmit, true);
  }

  private _configureFields(include: boolean, fields: Array<keyof TFormValue>, controls?: Partial<TKeysOf<TFormValue, FormControl>>, skipEmit = false, dryRun = false) {
    const length = fields.length;
    const add: string[] = [];
    const remove: string[] = [];
    let requiresChanges = false;

    if (this.debug && !dryRun) {
      this.outputDebug(`configureFields invoked with include:${include} and fields:`, fields);
    }

    fields.forEach((field: any, i: number) => {
      const emitEvent = !skipEmit && (length === (i + 1));

      if (include) {
        if (!this._form.controls[field]) {
          if (this.debug && !dryRun) {
            this.outputDebug('configureField adding control:', { field, emitEvent });
          }

          if (!dryRun) {
            this._form.addControl(field, controls ? (controls[field] || new FormControl()) : new FormControl(), { emitEvent });
          }

          add.push(field);
          requiresChanges = true;
        }
      } else {
        if (this._form.controls[field]) {
          if (this.debug && !dryRun) {
            this.outputDebug('configureField removing control:', { field, emitEvent });
          }

          if (!dryRun) {
            this._form.removeControl(field, { emitEvent });
          }

          remove.push(field);
          requiresChanges = true;
        }
      }
    });

    return { add, remove, requiresChanges };
  }

  protected subscribe($: Observable<any>) {
    this.subscriptions.push($.subscribe());
  }

  protected keysOf(controls: TKeysOf<Partial<TFormValue>, FormControl>, filterFn?: (key: keyof Partial<TFormValue>) => boolean) {
    const keys = Object.keys(controls);

    return filterFn ?
      keys.filter(key => filterFn(key)) as Array<keyof Partial<TFormValue>> :
      keys;
  }
}
