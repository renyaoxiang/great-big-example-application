import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs/observable/of';

import { Article, initialArticle } from './article.model';
import { slices } from '../util';
import { RESTService } from '../../services/rest.service';
import * as entityFunctions from '../entity/entity.functions';
import * as sliceFunctions from '../slice/slice.functions';
import { typeFor } from '../util';
import { actions } from './article.actions';
import { SliceAction } from '../slice/slice.actions';
import * as EntityActions from '../entity/entity.actions';
import * as ArticleActions from './article.actions';
import { initialBlogPageLayout } from '../../../features/blog/blog.layout';
import * as SliceActions from '../slice/slice.actions';
import * as fromRoot from '../../../core/store';
import { PayloadAction, handleNavigation } from '../util';
import { RootState } from '../';

@Injectable()
export class ArticleEffects {
    // @Effect()
    // private loadFromRemote$ = entityFunctions.loadFromRemote$(this.actions$, slices.ARTICLE, this.dataService);
    @Effect()
    private updateToRemote$ = entityFunctions.updateToRemote$(this.actions$, slices.ARTICLE, this.dataService, this.store);
    @Effect()
    private addToRemote$ = entityFunctions.addToRemote$(this.actions$, slices.ARTICLE, this.dataService, this.store, initialArticle);
    // @Effect()
    // private addCommentToRemote$ = sliceFunctions.postToRemote$(this.actions$, slices.COMMENT, this.dataService, this.store, new EntityActions.AddSuccess(), new EntityActions.AddUpdateFail());

    @Effect()
    private navigateOnArticleAddSuccess = this.actions$
        .ofType(typeFor(slices.ARTICLE, actions.ADD_SUCCESS))
        .map((action) => {
            this.router.navigateByUrl('/features/blog/article/' + action.payload.slug);
            return Observable.empty();
        });

    @Effect()
    private navigateOnArticleDeleteSuccess = this.actions$
        .ofType(typeFor(slices.ARTICLE, actions.DELETE_SUCCESS))
        .map((action) => {
            this.router.navigateByUrl('/features/blog/article/');
            return Observable.empty();
        });

    /*
     * Select the article whose slug is contained in the route
     */
    @Effect()
    navigateToArticle$ = handleNavigation(this.store, this.actions$, '/features/blog/article/:slug', (r: ActivatedRouteSnapshot, state: RootState) => {
        const slug = r.firstChild.firstChild.paramMap.get('slug');
        this.store.dispatch(new EntityActions.Select(slices.ARTICLE, { id: slug }));
        return of();
    });

    @Effect()
    selectArticle$ = entityFunctions.select$(this.actions$, slices.ARTICLE, this.dataService, this.store, initialArticle);



    @Effect()
    private favorite$ = sliceFunctions.postToRemote$(this.actions$, slices.ARTICLE, this.dataService, actions.FAVORITE, new ArticleActions.FavoriteSuccess(), new ArticleActions.FavoriteFail());

    @Effect()
    private unFavorite$ = sliceFunctions.deleteFromRemote$(this.actions$, slices.ARTICLE, this.dataService, actions.UNFAVORITE, new ArticleActions.UnfavoriteSuccess(), new ArticleActions.UnfavoriteFail());

    @Effect()
    private addComment$ = sliceFunctions.postToRemote$(this.actions$, slices.ARTICLE, this.dataService, actions.ADD_COMMENT, new ArticleActions.AddCommentSuccess(), new ArticleActions.AddCommentFail());

    constructor(
        private store: Store<RootState>,
        private actions$: Actions<PayloadAction>,
        private router: Router,
        private dataService: RESTService
    ) { }
}