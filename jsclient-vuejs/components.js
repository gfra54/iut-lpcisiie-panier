Vue.component('produit',{
	props		: ['produit'],
	template	: 
	`<div class="produit">
		<h2>{{ produit.nom }}</h2>
		<p>{{ produit.description }}</p>
		<big><b>{{ produit.prix }}</b></big>
		<produit-image :url="produit.image"></produit-image>
		<bouton-ajouter :id="produit.id"></bouton-ajouter>
	</div>`
});

Vue.component('bouton-ajouter',{
	props		: ['id'],
	template	: `<input type="button" v-on:click="ajouter" :data-id="id" value="Ajouter au panier">`,
	methods		: {
		ajouter: function() {
		  	var cmp = this;
		  	this.$http.post(endpoint+'cart/'+cmp.id).then(function(response) {
		  		app.panier = response.data
		  	});
		}
	}
});

Vue.component('produit-image',{
	props		: ['url'],
	template	: 
	`<div class="produit-image" :style="{ 'background-image':'url('+url+')'}">
	</div>`
});



Vue.component('panier-produit',{
	props		: ['produit'],
	template	: 
	`<div class="panier-produit">
		<b>{{ produit.nom }}</b> x {{ produit.qte }} &middot; {{ produit.prix }}€
	</div>`
});


