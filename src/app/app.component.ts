import { ApplicationRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { interval, concat } from 'rxjs';
import { first } from 'rxjs/operators';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'newApp';
  updateAvailable = false;

  constructor(private snackbar: MatSnackBar, private swUpdate: SwUpdate, private appRef: ApplicationRef) { }

  ngOnInit() {
    this.checkUpdate();
    // if(this.swUpdate.available){
    //   this.openSnackbar()
    // }
    // this.checkUpdate()
  }

  openSnackbar() {
    const snack = this.snackbar.open('Update Available', 'Install Now!', { duration: 10000 });

    snack
      .onAction()
      .subscribe(() => {
        // this.updateClient()
        window.location.reload();
      });
    if(snack.afterDismissed()){
      console.log('afterDismissed: ', snack.afterDismissed())

    } else {
      console.log('else: ', snack)
    }
    // snack
    //   .afterDismissed().subscribe(() => {
    //     this.updateAvailable=true;
    //   }) 
  }

  // updateClient() {
  //   console.log('update Client')
  //   if (!this.swUpdate.isEnabled) {
  //     console.log("Updates not enabled")
  //     return
  //   } else {
  //     console.log('else')
  //     console.log(this.swUpdate)
  //     this.swUpdate.available.subscribe((event) => {
  //       console.log('current: ', event.current, 'available: ', event.available)
  //     })

  //     this.swUpdate.activated.subscribe((event) => {
  //       console.log('current: ', event.previous, 'available: ', event.current)
  //     })
  //   }

  // }

  checkUpdate() {

    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(60000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(() => this.swUpdate.checkForUpdate().then(() => console.log('checked!')));

    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        const timeInterval = interval(10000)
        timeInterval.subscribe(() => {
          this.swUpdate.checkForUpdate().then(() => { console.log('checked!', this.swUpdate.available) })
          if(this.swUpdate.available){
            this.openSnackbar();
          } else {
            console.log('no update found!')
          }
          console.log('update checked!')
        })
      }
    })
  }
}
