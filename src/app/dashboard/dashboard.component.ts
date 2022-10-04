import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

//
export interface YearsMultipleWinners {
  year: number;
  winnerCount: number;
}

const YEAR_MULTIPLE_WINNERS_DATA: YearsMultipleWinners[] = [];


//
export interface StudiosWithWinCount {
  name: number;
  winCount: number;
}

const STUDIOS_WITH_WIN_COUNT_DATA: StudiosWithWinCount[] = [];



//
export interface MaxMinWinIntervalForProducer {
  producer: string,
  interval: number,
  previousWin: number,
  followingWin: number
}

const MAX_WIN_INTERVAL_FOR_PRODUCER_DATA: MaxMinWinIntervalForProducer[] = [];

const MIN_WIN_INTERVAL_FOR_PRODUCER_DATA: MaxMinWinIntervalForProducer[] = [];

//

export interface ListMoviesWinnerByYear {
  id: number,
  year: number,
  title: string
}

const LIST_MOVIES_WINNER_BY_YEAR_DATA: ListMoviesWinnerByYear[] = [];


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  //
  displayedColumnsYearsMultipleWinners: string[] = ['year', 'winnerCount'];
  dataSourceYearsMultipleWinners: MatTableDataSource<YearsMultipleWinners> = new MatTableDataSource(YEAR_MULTIPLE_WINNERS_DATA);

  //
  displayedColumnsStudiosWithWinCount: string[] = ['year', 'winCount'];
  dataSourceStudiosWithWinCount: MatTableDataSource<StudiosWithWinCount> = new MatTableDataSource(STUDIOS_WITH_WIN_COUNT_DATA);

  //
  displayedColumnsMaxWinIntervalForProducer: string[] = [ 'producer', 'interval', 'previousWin', 'followingWin'];
  dataSourceMaxWinIntervalForProducer: MatTableDataSource<MaxMinWinIntervalForProducer> = new MatTableDataSource(MAX_WIN_INTERVAL_FOR_PRODUCER_DATA);
  
  //
  displayedColumnsMinWinIntervalForProducer: string[] = [ 'producer', 'interval', 'previousWin', 'followingWin'];
  dataSourceMinWinIntervalForProducer: MatTableDataSource<MaxMinWinIntervalForProducer> = new MatTableDataSource(MIN_WIN_INTERVAL_FOR_PRODUCER_DATA);

  
  //
  displayedColumnsListMoviesWinnerByYear: string[] = [ 'id', 'year', 'title'];
  dataSourceListMoviesWinnerByYear: MatTableDataSource<ListMoviesWinnerByYear> = new MatTableDataSource(LIST_MOVIES_WINNER_BY_YEAR_DATA);
  

  yearFilter = new FormControl('');
  
  filterValues = {
    year: ''
  };
  
  constructor(private dashboardService: DashboardService) {
    this.dataSourceListMoviesWinnerByYear.filterPredicate = this.createFilter();
  }

  ngOnInit(): void {    
    this.loadData();
  }


  searchMovie(){
    console.log(this.yearFilter.value)
    if ( this.yearFilter.value !== '' ){
      this.filterValues.year = this.yearFilter.value || '';
      this.dataSourceListMoviesWinnerByYear.filter = JSON.stringify(this.filterValues);
      this.loadData();
    }
    
  }
  
  loadData() {

    //
    this.dashboardService.getYearsMultipleWinners()
      .then((res: any) => {
        this.dataSourceYearsMultipleWinners.data = res.years;
      }, (error: any) => {
        console.log(error);
      });


    //
    this.dashboardService.getStudiosWithWinCount()
      .then((res: any) => {
        this.dataSourceStudiosWithWinCount.data = res.studios.slice(0,3);
      }, (error: any) => {
        console.log(error);
      });


    //
    this.dashboardService.getMaxWinIntervalForProducer()
      .then((res: any) => {
        this.dataSourceMaxWinIntervalForProducer.data = res.max;
        this.dataSourceMinWinIntervalForProducer.data = res.min;
      }, (error: any) => {
        console.log(error);
      });

    
    //
    this.dashboardService.getMoviesByYear(this.filterValues)
      .then((res: any) => {
        this.dataSourceListMoviesWinnerByYear.data = res;
      }, (error: any) => {
        console.log(error);
      });
    

  }


  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data: any, filter: any): boolean {
      let searchTerms = JSON.parse(filter);
      return data.year.toString().toLowerCase().indexOf(searchTerms.year) !== -1;
      
    }
    return filterFunction;
  }

}
