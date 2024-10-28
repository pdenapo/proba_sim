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
	import { MenuField, NumberStepper, State,Button } from 'svelte-ux';

	function new_data(random)
	{
		return Array.from({ length: randomCount }, () => random())
	}

	let selectedGenerator = 'normal';
	let randomCount = 1000;
	let howManyBins = 10;
	$: random = randomNormal();
	$: randomData = new_data(random);
	$: binByValues = bin().thresholds(howManyBins); //.domain([0, 1]);
	$: randomBins = binByValues(randomData);
</script>

<main class="p-4 w-full max-w-[1200px] mx-auto">
	<h1 class="text-2xl font-semibold mb-2 text-center">Histograma de una distribución de probabilidades</h1>
	<div>
		<div class="grid grid-cols-[1fr,148px,148px] gap-2 my-2">
			<MenuField
				label="Histograma de una Distribución de probabilidades"
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
				on:change={(e) => {
					switch (e.detail.value) {
						case 'normal':
							random = randomNormal();
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
				}}
			/>

			<NumberStepper label="Cuantos Ensayos" bind:value={randomCount} class="w-full" />
			<NumberStepper label="Cuantas Cajitas" bind:value={howManyBins} class="w-full" />
		</div>

		<h2>Histograma de los puntos generados</h2>

		<State
			><div class="h-[300px] p-4 border rounded">
				<BarChart
					data={randomBins}
					x="x0"
					y="length"
					bandPadding={0.2}
					props={{
						xAxis: { tweened: true },
						yAxis: { format: 'metric', tweened: true },
						bars: { tweened: true }
					}}
				>
					<svelte:fragment slot="tooltip">
						<Tooltip.Root let:data>
							<Tooltip.Header class="text-center"
								>{data.x0 + ' - ' + (data.x1 - 0.01)}</Tooltip.Header
							>
							<Tooltip.List>
								<Tooltip.Item label="count" value={data.length} format="integer" />
								<Tooltip.Separator />
								{#each data.slice(0, 5) as d}
									<Tooltip.Item label="value" value={d} />
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
		</State>
		<div class=" p-4 w-full max-w-[1200px] mx-auto flex"></div>
		<Button variant="fill" color="primary" rounded="full" on:click={() => randomData = new_data(random)} 
			class="p-4 text-xl text-white">Nuevo ensayo</Button
		>
		</div>
</main>
