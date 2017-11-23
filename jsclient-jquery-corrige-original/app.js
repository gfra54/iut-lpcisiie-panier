var products = {};
var cart = {};
var endpoint = '../jsserver/public/';
$('document').ready(function(){

    //initialisation de la liste des produits
    $.get(endpoint+'products', function(data){
        if(data != undefined )
        for(i in data){
            var p = data[i];
            display_product(p);
            products[p.id] = p;
        }
    });

    var toto = function(data){
        cart = data;
        display_cart(cart);
    };
    //initialisation du panier
    $.get(endpoint+'cart').done(toto).fail(function(data){//si le panier est vide, le retour json aussi
        $('#empty').attr('disabled', 'disabled');
        $('#buy').attr('disabled', 'disabled');
    });

    //Event handler pour pouvoir vider le panier
    $('#empty').click(function(e){
       empty_cart();
    });

    //Event handler pour le bouton commander
    $('#buy').click(function(e){
        $('.colis').remove();
        $('.cart-message').remove();
        var counter = 0;
        var total = Object.keys(cart).length;
        for(i in cart){
            var product = cart[i];
            product.colis = false;
            product.expedition = false;
            ( function(i){//Essayez sans ...
                $.ajaxSetup({
                    url: endpoint+'cart/'+i+'/buy',
                    data: {id: i},
                    method: 'PUT'
                });

                $.ajax().done(handle_packaging(i));
            } )(i);
        }
    });
});

function display_product(p){
    var product = $('<div class="product"></product>');
    product.append('<div class="title"><strong>'+p.nom+' (<span class="price">'+p.prix+'€</span>)</strong></div>');
    product.append('<img src="http://lorempixel.com/180/100/technics/'+i+'"/>');
    product.append('<div class="desc">'+p.description+'</div>');
    var addbtn = $('<button data-ref="'+p.id+'">Ajouter au panier</button>');
    addbtn.click(add_to_cart);
    product.append(addbtn);
    $('#products').append(product);
}

function add_to_cart(){
    var id = $(this).attr('data-ref');
    $.post(endpoint+'cart/'+id, function(data){
        cart = data;
        display_cart(cart);
        $('.full-success').remove();
    });
}

function display_cart(data){
    var domcart = $('#panier-content');
    domcart.empty();
    var total = 0;
    if(data != undefined && data != null){
        for(pid in data){
            domcart.append('<div data-product-id="'+pid+'"><span>'+data[pid].nom+'</span><span class="cart-qte">x'+data[pid].qte+'</span><span class="cart-prix">'+data[pid].prix+'€</span></div>');
            total += data[pid].prix;
        }
    }

    domcart.append('<div class="big-total"><strong>Total : '+(Math.round(total*100) / 100)+'€</strong></div>')
    if(total > 0){
        $('#empty').removeAttr('disabled', 'disabled');
        $('#buy').removeAttr('disabled', 'disabled');
    }
    else{
        $('#empty').attr('disabled', 'disabled');
        $('#buy').attr('disabled', 'disabled');
    }
}

function empty_cart(){
    if(confirm('Êtes vous sûr de vouloir vider votre panier ?')){
        $.ajax({
            url: endpoint+'cart',
            method: 'DELETE',
            success: function(data){
                display_cart(null);
                $('#empty').attr('disabled', 'disabled');
                $('#buy').attr('disabled', 'disabled');
                $('.cart-message').remove();
            }
        });
    }
}

function handle_packaging(product_id){
    return function(data){//à votre avis, pourquoi la fonction retourne-t-elle une fonction anonyme ?
        if(data != undefined && data.success == 1){
            cart[product_id].colis = true;
            $('[data-product-id='+product_id+'] span:first-child').prepend('<span class="colis">C - </span>');
            if(check_full_packaging()){
                trigger_expedition();
            }
        }
    }
}

function check_full_packaging(){
    var c = 0;
    for(i in cart){
        if(cart[i].colis){
            c++;
        }
    }
    if(c == Object.keys(cart).length){
        show_cart_status('Les colis sont prêts', 'packaging-ready');
        return true;
    }
    else return false;
}

function show_cart_status(text, type){
    if($('.cart-message').length == 0){
        $('#panier').append('<div class="cart-message"></div>');
    }
    $('.cart-message').attr('class', 'cart-message '+type).text(text);
}

function trigger_expedition(){
    var counter = 0;
    var total = Object.keys(cart).length;
    for(i in cart){
        (function(i){//Essayez sans ...
            $.ajax({
                method: 'PUT',
                url: endpoint+'cart/'+i+'/buy',
                success: function(data){
                    $('[data-product-id='+i+'] span.colis').append('E - ');
                    counter++;
                    if(counter == total){
                        show_cart_status('Panier traité avec succès', 'full-success');
                    }
                }
            });
        })(i);
    }
}

// $(function(){
//     member = {fullname: "Cyril Rouyer", email: "bob@bob.fr"}
//     $.ajax({
//         url: 'http://localhost:3000/api/members',
//         method: 'POST',
//         headers: {Authorization: "Token token=67a3f1687c0f42afb858f9b07949bf2f"},
//         data: {member: member},
//         success: function(data){
//             console.log(data);
//         }
//     });
// });
