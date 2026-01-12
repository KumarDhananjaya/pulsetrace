import { Breadcrumb } from './types';

export class BreadcrumbManager {
    private breadcrumbs: Breadcrumb[] = [];
    private readonly maxBreadcrumbs: number;

    constructor(maxBreadcrumbs: number = 20) {
        this.maxBreadcrumbs = maxBreadcrumbs;
    }

    public addBreadcrumb(breadcrumb: Omit<Breadcrumb, 'timestamp'>) {
        const fullBreadcrumb: Breadcrumb = {
            ...breadcrumb,
            timestamp: Date.now(),
        };

        this.breadcrumbs.push(fullBreadcrumb);

        if (this.breadcrumbs.length > this.maxBreadcrumbs) {
            this.breadcrumbs.shift();
        }
    }

    public getBreadcrumbs(): Breadcrumb[] {
        return [...this.breadcrumbs];
    }

    public clear() {
        this.breadcrumbs = [];
    }
}
