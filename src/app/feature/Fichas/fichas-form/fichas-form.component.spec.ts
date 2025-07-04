import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichasFormComponent } from './fichas-form.component';

describe('FichasFormComponent', () => {
  let component: FichasFormComponent;
  let fixture: ComponentFixture<FichasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichasFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
