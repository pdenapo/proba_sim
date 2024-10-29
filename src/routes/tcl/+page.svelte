<script lang="ts">
	import { bin } from 'd3-array';
	import {
		randomBates,
		randomExponential,
		randomInt,
		randomLogNormal,
		randomNormal,
		randomUniform
	} from 'd3-random';

	import { BarChart, Tooltip } from 'layerchart';
	import { MenuField, NumberStepper, Button } from 'svelte-ux';
	// math equations
	import katex from 'katex';
	const eq1 = String.raw`\overline{X}_n=\frac{X_1+X_2+\ldots+X_n}{n}`;
	const eq2 = String.raw`Z_n=\frac{\sqrt{n}\cdot \left(\overline{X}_n-\mu\right)}{\sigma}`;
	const eq3 = String.raw`Z_n`;

	let selectedGenerator = 'normal';
	let howManyBins = 100;

	interface Parameters {
		cuantos: number;
		mu: number;
		sigma: number;
		n: number;
	}

	// Los parámetros para generar los datos

	let parameters = {
		cuantos: 10000,
		mu: 0,
		sigma: 1,
		n: 1
	} satisfies Parameters;

	function new_data(random: () => number, parameters: Parameters, generator: string) {
		switch (generator) {
			case 'normal':
				parameters.mu = 1;
				parameters.sigma = 1;
				random = randomNormal(parameters.mu, parameters.sigma);
				break;
			case 'uniform':
				const a = 0;
				const b = 1;
				random = randomUniform(a, b);
				parameters.mu = (a + b) / 2;
				parameters.mu = Math.sqrt(((a - b) * (a - b)) / 12);
				break;
			case 'integer':
				random = randomInt(1, 6);
				parameters.mu = 3.5;
				parameters.mu = 1.7078251276599330638701731134201753318;
				break;
			case 'logNormal':
				random = randomLogNormal(parameters.mu, parameters.sigma);
				break;
			case 'exponential':
				random = randomExponential(10);
				parameters.mu = 1 / 10;
				parameters.sigma = 1 / 10;
				break;
		}
		return Array.from({ length: parameters.cuantos }, () => {
			let s = 0;
			for (let i = 0; i < parameters.n; i++) {
				s += random();
			}
			let xn = s / parameters.n;
			let zn = ((xn - parameters.mu) / parameters.sigma) * Math.sqrt(parameters.n);
			return zn;
		});
	}

	$: random = randomNormal();
	$: randomData = new_data(random, parameters, selectedGenerator);
	$: binByValues = bin().thresholds(howManyBins);
	$: randomBins = binByValues(randomData);
	$: barData = randomBins.map((b) => {
		return {
			bin: b,
			x0: b.x0,
			x1: b.x1,
			length: b.length,
			frequency: b.length / parameters.cuantos
		};
	});
</script>

<main class="p-4 w-full max-w-[1200px] mx-auto">
	<h1 class="text-2xl font-semibold mb-2 text-center">Simulación del teorema del Límite Central</h1>

	<div>
		<div class="grid grid-cols-[1fr,148px,148px,148px] gap-2 my-2">
			<MenuField
				label="Elija qué distribucion de probabilidades quiere simular"
				options={[
					{
						label: 'Normal',
						value: 'normal'
					},
					{
						label: 'Uniforme en el Intervalo [0,1]',
						value: 'uniform'
					},
					{
						label: 'Entero del 1 al 6 (Dado)',
						value: 'integer'
					},
					{
						label: 'log-Normal',
						value: 'logNormal'
					},
					{
						label: 'Exponential',
						value: 'exponential'
					}
				]}
				bind:value={selectedGenerator}
				on:change={() => (randomData = new_data(random, parameters, selectedGenerator))}
			/>

			<NumberStepper
				label="Ensayos"
				bind:value={parameters.cuantos}
				class="w-full"
				on:change={() => (randomData = new_data(random, parameters, selectedGenerator))}
			/>
			<NumberStepper label="Intervalos" bind:value={howManyBins} class="w-full" />

			<NumberStepper
				label="n"
				bind:value={parameters.n}
				class="w-full"
				on:change={() => (randomData = new_data(random, parameters, selectedGenerator))}
			/>
		</div>

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

		<div class="w-full aspect-[1.5/1] max-h-[600px] p-4 border rounded">
			<BarChart
				data={barData}
				x="x0"
				y="frequency"
				bandPadding={0.2}
				props={{
					xAxis: {
						tweened: true,
						ticks: 10
					},
					bars: { tweened: true }
				}}
			>
				<svelte:fragment slot="tooltip">
					<Tooltip.Root let:data>
						<Tooltip.Header class="text-center">{data.x0 + ' - ' + (data.x1 - 0.01)}</Tooltip.Header
						>
						<Tooltip.List>
							<Tooltip.Item label="cuantos" value={data.length} format="integer" />
							<Tooltip.Item
								label="frecuencia"
								value={`${data.length} / ${parameters.cuantos} = ${data.frequency}`}
								format="metric"
							/>
							<Tooltip.Separator />
							{#each data.bin.slice(0, 5) as d}
								<Tooltip.Item label="valor" value={d} />
							{/each}
							{#if data.length > 5}
								<span></span>
								<span>...</span>
							{/if}
						</Tooltip.List>
					</Tooltip.Root>
				</svelte:fragment>
			</BarChart>
		</div>
		<div class=" p-4 w-full max-w-[1200px] mx-auto flex"></div>
		<Button
			variant="fill"
			color="primary"
			rounded="full"
			on:click={() => (randomData = new_data(random, parameters, selectedGenerator))}
			class="p-4 text-xl text-white">Nueva simulación</Button
		>
	</div>
	<!-- <pre>barData={JSON.stringify(barData)}</pre> -->
</main>
