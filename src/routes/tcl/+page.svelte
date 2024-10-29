<script lang="ts">
	import Simulador from '../../components/Simulador.svelte'
	// math equations
	import katex from 'katex';
	const eq1 = String.raw`\overline{X}_n=\frac{X_1+X_2+\ldots+X_n}{n}`;
	const eq2 = String.raw`Z_n=\frac{\sqrt{n}\cdot \left(\overline{X}_n-\mu\right)}{\sigma}`;
	const eq3 = String.raw`Z_n`;
</script>


	<Simulador title="Simulación del teorema del Límite Central" que_simulacion={3}>
		Recordamos el enunciado del<a
			href="https://es.wikipedia.org/wiki/Teorema_del_l%C3%ADmite_central"
			class="text-red-700 px-2"
		>
			Teorema del límite central</a
		>: Consideramos los promedios en n realizaciones independientes del experimento:
		{@html katex.renderToString(eq1, { displayMode: true })}
		entonces la variable nomralizada
		{@html katex.renderToString(eq2, { displayMode: true })}
		converge en distribución a una variable normal con esperanza 0 y varianza 1. Hacemos un histograma
		de una simulación de {@html katex.renderToString(eq3)}

	</Simulador>	
