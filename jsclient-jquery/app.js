var url_endpoint= '../jsserver/public/';
$(function(){


	/***************************************
		Gestion des events
	*/

	$(document).on('click', '.ajout-panier', function(){
		var id_produit = $(this).data('id');

		$.post(url_endpoint+'cart/'+id_produit,function(panier){
			console.table(panier);
			var html=[];
			for(var cle in panier) {
				html.push('<div class="produit-panier">');
				html.push('<h3>'+panier[cle].nom+'</h3>');	
				html.push('</div>');		
			}
			if (html.length) {
				$(".contenu-panier").html(html.join(""));			
			}
	
		});
	});



	/***************************************
		Appel de la liste des produits
	*/
	$.get(url_endpoint+'products',function(produits){
		var html=[];
		for(var cle in produits) {
			html.push('<div class="produit">');
			html.push('<h3>'+produits[cle].nom+'</h3>');
			html.push('<p>'+produits[cle].description+'</p>');
			html.push('<big><b>'+produits[cle].prix+'€</b></big>');
			html.push('<input class="ajout-panier" data-id="'+produits[cle].id+'" type="button" value="Ajouter au panier">');		
			html.push('</div>');		
		}
		$('.produits').html(html.join(''));

	});


	/***************************************
		Appel du contenu du panier
	*/

	$.get(url_endpoint+'cart',function(panier){
		console.log(panier);

	});




})



