<script lang="ts">
	import { bin } from 'd3-array';
	import {
		randomExponential,
		randomInt,
		randomBernoulli,
		randomNormal,
		randomUniform,
		randomCauchy
	} from 'd3-random';

	import { BarChart, Tooltip } from 'layerchart';
	import { MenuField, NumberStepper, Button,Card } from 'svelte-ux';

	export let title:string
	export let que_simulacion:number;
	let selectedGenerator = 'normal';
	let howManyBins = 100;
	let mu:number
	let sigma:number


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
		let p:number;
		switch (generator) {
			case 'normal':
				parameters.mu = 0;
				parameters.sigma = 1;
				random = randomNormal(parameters.mu, parameters.sigma);
				break;
			case 'uniform':
				const a = 0;
				const b = 1;
				random = randomUniform(a, b);
				parameters.mu = (a + b) / 2;
				parameters.sigma = Math.sqrt(((a - b) * (a - b)) / 12);
				break;
			case 'integer':
				random = randomInt(1, 7);
				parameters.mu = 3.5;
				parameters.sigma = 1.7078251276599330638701731134201753318;
				break;
			case 'exponential':
				random = randomExponential(10);
				parameters.mu = 1 / 10;
				parameters.sigma = 1 / 10;
				break;
			case 'bernoulli0.2':
				p=0.2
				random = randomBernoulli(p);
				parameters.mu = p;
				parameters.sigma = Math.sqrt(p*(1-p));
				break;
			case 'bernoulli0.4':
				p=0.4
				random = randomBernoulli(p);
				parameters.mu = p;
				parameters.sigma = Math.sqrt(p*(1-p));
				break;
			case 'bernoulli0.5':
				p=0.5
				random = randomBernoulli(p);
				parameters.mu = p;
				parameters.sigma = Math.sqrt(p*(1-p));
				break;
		}
		mu=parameters.mu
		sigma=parameters.sigma
		return Array.from({ length: parameters.cuantos }, () => {
			let s = 0;
			for (let i = 0; i < parameters.n; i++) {
				s += random();
			}
			if (que_simulacion==1)
				return s;
			let xn = s / parameters.n;
			if (que_simulacion==2)
				return xn;
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

	const getAverage = (array) =>
  array.reduce((sum, currentValue) => sum + currentValue, 0) / array.length;

  function getStandardDeviation (array) {
  if (!array || array.length === 0) {return undefined;}	
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}
	
	$: media_muestral= getAverage(randomData);
	$: varianza_muestral= getStandardDeviation(randomData);

</script>

<main class="p-4 w-full max-w-[1200px] mx-auto">
	<h1 class="text-2xl font-semibold mb-2 text-center">{title}</h1>

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
						label: 'Exponencial',
						value: 'exponential'
					},
					{
						label: 'Bernoulli con p=0.2',
						value: 'bernoulli0.2'
					},
					{
						label: 'Bernoulli con p=0.4',
						value: 'bernoulli0.4'
					},
					{
						label: 'Bernoulli con p=0.5',
						value: 'bernoulli0.5'
					},
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

			{#if que_simulacion !=1}
			<NumberStepper
				label="n"
				bind:value={parameters.n}
				class="w-full"
				on:change={() => (randomData = new_data(random, parameters, selectedGenerator))}
			/>
			{/if}
		</div>

	  <slot/>
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

		<div class="flex justify-center p-4">
			<Card class="w-3/4">
				<table>
					<tr>
						<td> Esperanza  de la distribucion</td>
						<td>{mu}
					</tr>
					<tr>
						<td> Desviación Estándar de la distribucion</td>
						<td>{sigma}
					</tr>
					<tr>
						<td> Media Muestral</td>
						<td>{media_muestral}
					</tr>

					<tr>
						<td> Varianza Muestral</td>
						<td>{varianza_muestral}
					</tr>



				</table>
			</Card>
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

</main>
