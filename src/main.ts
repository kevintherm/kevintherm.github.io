import './index.css';
import Alpine from 'alpinejs';
// @ts-ignore
import sticky from 'alpinejs-sticky';
// @ts-ignore
import collapse from '@alpinejs/collapse';
 
declare global {
    interface Window {
        Alpine: typeof Alpine;
    }
}
 
window.Alpine = Alpine;

Alpine.plugin(sticky);
Alpine.plugin(collapse);

Alpine.data("navbar", () => ({
    show: false,
    darkmode: "",
    init() {
        this.applyDark();
    },
    toggleMode() {
        if (localStorage.theme === "dark") {
            localStorage.theme = "light";
        } else if (localStorage.theme === "light") {
            localStorage.removeItem("theme");
        } else {
            localStorage.theme = "dark";
        }

        this.applyDark();
    },
    applyDark() {
        if (localStorage.theme === "dark") {
            this.darkmode = "dark";
            document.documentElement.classList.add("dark");
        } else if (localStorage.theme === "light") {
            this.darkmode = "light";
            document.documentElement.classList.remove("dark");
        } else {
            this.darkmode = "system";
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    },
}));

Alpine.data("projects", () => ({
    projects: [],
    loading: true,
    featuredRepos: ['velo', 'velo-flashcard', 'tracks', '2d-survival-game', 'work-my-sets', 'image-roaster'],
    async init() {
        try {
            const response = await fetch('https://api.github.com/users/kevintherm/repos?sort=updated');
            const data = await response.json();
            const demoUrls: Record<string, string> = {
                'velo': 'https://demo.velophp.com',
                'velo-flashcard': 'https://kevintherm.github.io/velo-flashcard'
            };

            this.projects = data
                .filter((repo: any) => this.featuredRepos.includes(repo.name))
                .map((repo: any) => ({
                    ...repo,
                    demo_url: demoUrls[repo.name] || repo.homepage || null
                }))
                .sort((a: any, b: any) => this.featuredRepos.indexOf(a.name) - this.featuredRepos.indexOf(b.name));
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            this.loading = false;
        }
    }
}));

Alpine.data("blog", () => ({
    posts: [],
    loading: true,
    async init() {
        try {
            const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@kevindrm');
            const data = await response.json();
            if (data.status === 'ok') {
                this.posts = data.items.map((item: any) => ({
                    id: item.guid,
                    title: item.title,
                    url: item.link,
                    pubDate: item.pubDate
                }));
            }
        } catch (error) {
            console.error("Error fetching blog posts:", error);
        } finally {
            this.loading = false;
        }
    }
}));

window.addEventListener("DOMContentLoaded", (): void => {
    const loader = document.querySelector<HTMLElement>("#loader");
    if (!loader) return;

    loader.style.zIndex = "-1";
    loader.style.opacity = "0";
});

Alpine.start();