import { Component, OnInit, ViewChild } from '@angular/core';
import { ListService } from './list.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

export interface WinnersElement {
  id: number;
  year: number;
  title: string;
  winner: string;
}

const ELEMENT_DATA: WinnersElement[] = [];

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'year', 'title', 'winner'];
  isLoading = false;
  totalRows = 0;
  pageSize = 15;
  currentPage = 0;
  totalPages = 0;  
  pageSizeOptions: number[] = [15];
  dataSource: MatTableDataSource<WinnersElement> = new MatTableDataSource(ELEMENT_DATA);

  yearFilter = new FormControl('');
  winnerFilter = new FormControl('');
  filterValues = {
    year: '',
    winner: ''
  };

  isWinnerOptions: any[] = [
    { key: 'true', value: 'Yes' },
    { key: 'false', value: 'No'}        
  ];  

  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.loadData();
  }
  


  constructor(private listService: ListService) {
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit(): void {

    this.yearFilter.valueChanges
      .subscribe(
        year => {
          this.filterValues.year = year  || '';
          this.dataSource.filter = JSON.stringify(this.filterValues);
          this.currentPage = 0;
          this.loadData();
        }
      );

    this.winnerFilter.valueChanges
      .subscribe(
        winner => {
          this.filterValues.winner = winner  || '';
          this.dataSource.filter = JSON.stringify(this.filterValues);
          this.currentPage = 0;
          this.loadData();
        }
      )

  }
  
  loadData() {
    
    this.isLoading = true;

    this.listService.getMovies(this.currentPage, this.pageSize, this.filterValues)
      .then((res: any) => {
        this.dataSource.data = res.content;
        this.totalPages = res.totalPages;
        
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = res.totalElements;
          
        });
        this.isLoading = false;        
      }, error => {
        console.log(error);
        this.isLoading = false;
      });
  }

  pageChanged(event: PageEvent) {    
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data: any, filter: any): boolean {
      let searchTerms = JSON.parse(filter);

      return data.year.toString().toLowerCase().indexOf(searchTerms.year) !== -1
        && data.winner.toString().toLowerCase().indexOf(searchTerms.winner) !== -1
      
    }
    return filterFunction;
  }

}
