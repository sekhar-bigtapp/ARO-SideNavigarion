import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SchedulingConfigService } from './scheduling-config.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-scheduling-config',
  templateUrl: './scheduling-config.component.html',
  styleUrls: ['./scheduling-config.component.css']
})
export class SchedulingConfigComponent implements OnInit {
  displayColumns: string[] = ['Job_Name', 'Job_Start', 'Job_End', 'Status', 'Actions'];
  jobSchedulers!: MatTableDataSource<any>;
  pageSize = 10;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  dailyForm!: FormGroup;
  weeklyForm!: FormGroup;
  monthlyForm!: FormGroup;
  jobName: any = "Hyper-V Backup Job";

  constructor(private schedulingConfigService: SchedulingConfigService, private formBuilder: FormBuilder,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.dailyForm = this.formBuilder.group({
      noOfDays: ['1'],
      time: ['', Validators.required]
    });
    this.weeklyForm = this.formBuilder.group({
      date: ['1'],
      time: ['', Validators.required],
      weekDay: ['', Validators.required]
    });
    this.monthlyForm = this.formBuilder.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      monthCount: ['1']
    });
    this.getJobSchedulers();
  }

  getJobSchedulers() {
    this.schedulingConfigService.getJobScheduler().subscribe((response) => {
      for (let resp of response) {
        resp.Job_Start = this.datepipe.transform(resp.Job_Start, 'yyyy-MM-dd hh:mm:ss');
        resp.Job_End = this.datepipe.transform(resp.Job_End, 'yyyy-MM-dd hh:mm:ss');
      }
      this.jobSchedulers = new MatTableDataSource(response);
      this.jobSchedulers.paginator = this.paginator;
      this.jobSchedulers.sort = this.sort;
    })
  }

  onDailyFormSubmit() {
    console.log(this.dailyForm.value);
    let Obj = {
      "Pattern": "Daily",
      "Job_Name": this.jobName,
      "No_Of_Days": this.dailyForm.value.noOfDays,
      "Time": this.dailyForm.value.time
    }
    console.log(Obj)
    this.schedulingConfigService.saveJobConfig(Obj).subscribe((response) => {
      console.log(response);
      this.dailyForm.reset();
      this.dailyForm.controls['noOfDays'].setValue(1);
    })
  }

  onWeeklyFormSubmit() {
    console.log(this.weeklyForm.value);
    let Obj = {
      "Pattern": "Weekly",
      "Job_Name": this.jobName,
      "No_Of_Weeks": this.weeklyForm.value.date,
      "Time": this.weeklyForm.value.time,
      "Days": this.weeklyForm.value.weekDay
    }
    console.log(Obj);
    this.schedulingConfigService.saveJobConfig(Obj).subscribe((response) => {
      console.log(response);
      this.weeklyForm.reset();
      this.weeklyForm.controls['date'].setValue(1);
    })
  }

  onMonthlyFormSubmit() {
    console.log(this.monthlyForm.value);
    let Obj = {
      "Pattern": "Monthly",
      "Job_Name": this.jobName,
      "Day": this.monthlyForm.value.date,
      "Time": this.monthlyForm.value.time,
      "Time_Duration": this.monthlyForm.value.monthCount
    }
    console.log(Obj);
    this.schedulingConfigService.saveJobConfig(Obj).subscribe((response) => {
      console.log(response);
      this.monthlyForm.reset();
      this.monthlyForm.controls['monthCount'].setValue(1);
    })
  }

  onKeyPress(event: any) {
    const pattern = /[\d]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}

