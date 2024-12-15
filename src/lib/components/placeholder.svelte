<script lang="ts">
	interface Props {
		image?: false | 'half' | 'full';
		comment?: boolean;
	}
	const { image = false, comment = false }: Props = $props();
</script>

<div class="placeholder">
	<div class="profile">
		<span class="profile__picture"></span>
		<div class="profile__text">
			<span class="profile__name">Name Namename</span>
			<span class="profile__date">0/00/0000...</span>
		</div>
	</div>
	<span class="placeholder__post">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac ornare sapien. Quisque a
		est sodales, dignissim lacus ut, tempor nisi. Duis faucibus urna a libero venenatis luctus. In
		leo erat, ornare nec ante ac, consequat blandit enim. Cras vel ligula quis ipsum lobortis
		gravida. Aliquam ac sagittis ligula, id vestibulum ante.
	</span>
	{#if image}
		<span class="placeholder__image placeholder__image--{image}"></span>
	{/if}
	{#if comment}
		<div class="placeholder__comment">
			<span class="profile__picture"></span>
			<span class="placeholder__comment__text">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac ornare sapien. Quisque
				a est sodales, dignissim lacus ut, tempor nisi. Duis faucibus urna a libero venenatis
				luctus. In leo erat, ornare nec ante ac, consequat blandit enim. Cras vel ligula quis ipsum
				lobortis gravida. Aliquam ac sagittis ligula, id vestibulum ante.
			</span>
		</div>
	{/if}
</div>

<style lang="scss">
	.placeholder {
		width: min(42rem, calc(100vw - 2 * 2rem));
		border-radius: 1rem;
		padding: 1rem;

		background-color: #303030;

		font-size: 0.9rem;

		margin: 1rem auto;

		display: flex;
		flex-direction: column;
		gap: 1rem;

		&__image {
			display: inline-block;
			width: 100%;

			background-color: #808080;

			&--full {
				height: 42rem;
			}

			&--half {
				height: 21rem;
			}
		}

		&__comment {
			padding-top: 1rem;
			border-top: #808080 solid 2px;

			display: flex;
			gap: 1rem;

			&__text {
				padding: 0.5rem;
				background-color: #404040;
				border-radius: 1rem;
			}

			.profile__picture {
				width: 1.8rem;
				height: 1.8rem;
			}
		}
	}

	.profile {
		display: flex;
		align-items: center;
		gap: 0.5em;

		&__picture {
			display: inline-block;
			width: 2.2rem;
			height: 2.2rem;
			border-radius: 50%;

			flex-shrink: 0;

			background-color: #808080;
		}

		&__text {
			display: flex;
			flex-direction: column;
		}

		&__name {
			font-weight: 600;
		}
	}
</style>
