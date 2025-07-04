import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichasListComponent } from './fichas-list.component';

describe('FichasListComponent', () => {
  let component: FichasListComponent;
  let fixture: ComponentFixture<FichasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
