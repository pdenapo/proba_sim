<script lang="ts">
	import {
		AppBar,
		AppLayout,
		Button,
		NavItem,
		Tooltip,
		settings,
		ThemeSelect,
		Icon
	} from 'svelte-ux';

	import { mdiPrinter } from '@mdi/js';

	import { page } from '$app/stores';
	import '@/app.postcss';

	settings({
		components: {
			AppBar: {
				classes: 'bg-primary text-white shadow-md'
			},
			AppLayout: {
				classes: {
					nav: 'bg-neutral-800 py-2'
				}
			},
			NavItem: {
				classes: {
					root: 'text-sm text-gray-400 pl-6 py-2 hover:text-white hover:bg-gray-300/10 [&:where(.is-active)]:text-sky-400 [&:where(.is-active)]:bg-gray-500/10'
				}
			}
		}
	});
</script>

<AppLayout>
	<svelte:fragment slot="nav">
		<NavItem
			path="/"
			text="Página de Inicio"
			icon="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"
			currentUrl={$page.url}
		/>

		<NavItem path="/histograma" text="Historgrama" currentUrl={$page.url} />

		<NavItem path="/tcl" text="Teorema del Límite Central" currentUrl={$page.url} />


		<NavItem
			path="/about"
			text="Acerca de"
			icon="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
			currentUrl={$page.url}
		/>
	</svelte:fragment>

	<AppBar title="Probabilidades">
		<div slot="actions" class="flex gap-3">
			<Tooltip title="Imprimir" placement="bottom" offset={2}>
				<Button on:click={() => window.print()} class="p-2" target="_blank"
					><Icon data={mdiPrinter} size="2em" /></Button
				>
			</Tooltip>

			<Tooltip title="Elegir modo" placement="bottom" offset={2}>
				<ThemeSelect />
			</Tooltip>
		</div>
	</AppBar>

	<main class="flex-1 flex items-center justify-center p-4">
		<slot />
	</main>
</AppLayout>
