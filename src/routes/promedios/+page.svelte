<script lang="ts">
	import Simulador from '../../components/Simulador.svelte'
	// math equations
	import katex from 'katex';
	const eq1 = String.raw`\overline{X}_n=\frac{X_1+X_2+\ldots+X_n}{n}`;
	const eq2 = String.raw`\overline{X}_n`;
</script>


	<Simulador title="Simulación de los Promedios en n realizaciones" que_simulacion={2}>
		Consideramos los promedios en n realizaciones independientes del experimento:
		{@html katex.renderToString(eq1, { displayMode: true })}
		Hacemos un histograma de una simulación de {@html katex.renderToString(eq2)}

	</Simulador>	
