Vue.prototype.$http = axios
var endpoint = 'http://www.sopress.local/panier/jsserver/public/';

var app = new Vue({
  el: '#app',

  created() {
  	var vm = this;
  	this.$http.get(endpoint+'products').then(function(response) {
  		vm.produits = response.data
  	});
  	this.$http.get(endpoint+'cart').then(function(response) {
  		vm.panier = response.data
  	});
  },

  methods: {
  	commander: function() {
  		for(cle in this.panier) {
  			produit = this.panier[cle];
  			
  		}
  	}
  },

  data: {
  	produits	: [],
  	panier		: []
  }
});

