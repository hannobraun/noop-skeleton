define "Graphics", [ "Rendering", "Vec2" ], ( Rendering, Vec2 ) ->
	module =
		createRenderState: ->
			renderState =
				renderables: []

		updateRenderState: ( renderState, gameState ) ->
			renderState.renderables.length = 0

			for entityId, position of gameState.components.positions
				imageId = gameState.components.imageIds[ entityId ]

				renderable = Rendering.createRenderable( "image", imageId )
				renderable.position = Vec2.copy( position )

				renderState.renderables.push( renderable )
