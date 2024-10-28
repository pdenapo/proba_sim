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

	let selectedGenerator = 'normal';
	let howManyBins = 100;

	interface Parameters {
		cuantos: number;
		mu: number;
		sigma: number;
	}

	let parameters = {
		cuantos: 1000,
		mu: 0,
		sigma: 1
	} satisfies Parameters;

	function new_data(random: () => number, parameters: Parameters, generator: string) {
		switch (generator) {
			case 'normal':
				random = randomNormal(parameters.mu, parameters.sigma);
				break;
			case 'uniform':
				random = randomUniform();
				break;
			case 'integer':
				random = randomInt(1, 10);
				break;
			case 'logNormal':
				random = randomLogNormal();
				break;
			case 'exponential':
				random = randomExponential(10);
				break;
			case 'bates':
				random = randomBates(10);
				break;
		}
		return Array.from({ length: parameters.cuantos }, () => random());
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
	<h1 class="text-2xl font-semibold mb-2 text-center">
		Histograma de una distribución de probabilidades
	</h1>

	<div>
		<div class="grid grid-cols-[1fr,148px,148px] gap-2 my-2">
			<MenuField
				label="Elija qué distribucion de probabilidades quiere simular"
				options={[
					{
						label: 'Normal',
						value: 'normal'
					},
					{
						label: 'Uniforme',
						value: 'uniform'
					},
					{
						label: 'Entero del 1 al 10',
						value: 'integer'
					},
					{
						label: 'log-Normal',
						value: 'logNormal'
					},
					{
						label: 'Exponential',
						value: 'exponential'
					},
					{
						label: 'Bates',
						value: 'bates'
					}
				]}
				bind:value={selectedGenerator}
			/>

			<NumberStepper
				label="Ensayos"
				bind:value={parameters.cuantos}
				class="w-full"
				on:change={() => (randomData = new_data(random, parameters, selectedGenerator))}
			/>
			<NumberStepper label="Cajitas" bind:value={howManyBins} class="w-full" />
		</div>

		<h2>Histograma de los puntos generados (frecuencias relativas)</h2>

		<div class="w-full aspect-[1.5/1] max-h-[600px] p-4 border rounded">
			<BarChart
				data={barData}
				x="x0"
				y="frequency"
				bandPadding={0.2}
				props={{
					xAxis: {
						format: 'metric',
						tweened: true
					},
					bars: { tweened: true }
				}}
			>
				<svelte:fragment slot="tooltip">
					<Tooltip.Root let:data>
						<Tooltip.Header class="text-center">{data.x0 + ' - ' + (data.x1 - 0.01)}</Tooltip.Header
						>
						<Tooltip.List>
							<Tooltip.Item label="cuantos" value={data.length} format="metric" />
							<Tooltip.Item
								label="frecuencia"
								value={`${data.length} / ${parameters.cuantos}= ${data.frequency}`}
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
