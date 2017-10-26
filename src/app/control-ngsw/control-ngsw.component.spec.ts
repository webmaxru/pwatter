import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlNgswComponent } from './control-ngsw.component';

describe('ControlNgswComponent', () => {
  let component: ControlNgswComponent;
  let fixture: ComponentFixture<ControlNgswComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlNgswComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlNgswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
