import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import { useData } from 'vitepress';
import FooterDoc from '../components/footerDoc.vue';
import GitHubStar from '../components/githubStar.vue';
import './custom.css';

export default {
	...DefaultTheme,
	Layout() {
		const Layout = DefaultTheme.Layout;
		const { page } = useData();

		return h(Layout, null, {
			'doc-footer-before': () => h(FooterDoc, { key: page.value.relativePath }),
			'nav-bar-content-after': () => h(GitHubStar),
		});
	},
};
