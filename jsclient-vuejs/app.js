Vue.prototype.$http = axios
var endpoint = '../jsserver/public/';

var app = new Vue({
    el: '#app',

    created() {
        this.$http.get(endpoint + 'products').then(function(response) {
            app.produits = response.data
        });
        this.$http.get(endpoint + 'cart').then(function(response) {
            app.panier = response.data
        });
    },

    methods: {
        vider: function() {
            app.$http.delete(endpoint + 'cart').then(function(response) {
                app.panier = response.data
            });
        },
        commander: function() {
            var qte_produits = Object.keys(app.panier).length
            for (var cle in app.panier) {
                (function(cle) {
                    app.$http.put(endpoint + 'cart/'+app.panier[cle].id+'/buy').then(function(response) {
                        qte_produits--;
                        app.panier[cle].ok=true;
                        if(qte_produits == 0) {
                            app.panierValide = true;
                            console.log('Terminé !')
                        }
                    });
                })(cle)
            }
        }
    },
    data: {
        produits: [],
        panier: [],
        panierValide:false
    }
});