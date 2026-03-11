document.addEventListener('alpine:init', () => {
    Alpine.data('MiniCart', () => ({
        cart: {},
        maxItemsDisplayCount: ALPINE_MINICART_MAX_ITEMS_DISPLAY_COUNT,
        minItemsDisplayCount: ALPINE_MINICART_MIN_ITEMS_DISPLAY_COUNT,
        count: ALPINE_MINICART_COUNT,
        loading: false,
        contentVisible: false,
        init() {
            Alpine.effect(async () => {
                this.cart = await Alpine.store('LocalStorage').get('cart');
            });
        },
        toggleContentVisible() {
            this.contentVisible = !this.contentVisible;
        },
        getCartSummaryCount() {
            if (!this.cart) {
                return 0;
            }

            if (this.cart.summary_count > 0) {
                return this.cart.summary_count;
            }
        },
        qtyClass() {
            if (!this.cart) {
                return 'empty';
            }

            return this.cart.summary_count > 0 ? '' : 'empty';
        },
        anchorClass() {
            return (this.loading) ? 'loading' : '';
        },
        proceedToCheckout() {
            window.location = ALPINE_MINICART_CHECKOUT_URL;
        },
        getCartItems() {
            return this.cart.items.slice(0, this.getCount());
        },
        getCount() {
            if (this.count > this.maxItemsDisplayCount) {
                this.count = this.maxItemsDisplayCount;
                return this.maxItemsDisplayCount;
            }

            return this.count;
        },
        showMaxButton() {
            return this.getCount() < this.maxItemsDisplayCount;
        },
        showMax() {
            this.count = this.maxItemsDisplayCount;
        },
        showMinButton() {
            return this.getCount() === this.maxItemsDisplayCount;
        },
        showMin() {
            this.count = this.minItemsDisplayCount;
        },
        toggleCartItemButton() {
            const cartItemOriginalQty = parseInt(this.$el.getAttribute('data-cart-item-qty'));
            const cartItemNewQty = parseInt(this.$el.value);
            const cartItemButton = this.$el.parentNode.querySelector('button');
            cartItemButton.style.display = (cartItemNewQty !== cartItemOriginalQty) ? 'inline-block' : 'none';
        },
        updateCartItemQty() {
            const cartItemId = this.$el.getAttribute('data-cart-item-id');
            const cartItemInput = document.getElementById('cart-item-' + cartItemId + '-qty');
            const cartItemQty = parseInt(cartItemInput.value);
            const cartItem = this.cart.items.find((item) => item.item_id === cartItemId);
            const currentQty = parseInt(cartItem.qty);

            if (currentQty === cartItemQty) {
                return;
            }

            const ajaxUpdateUrl = ALPINE_MINICART_UPDATE_CART_ITEM_URL;

            this.loading = true;
            fetch(ajaxUpdateUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                body: new URLSearchParams({
                    'item_id': cartItemId,
                    'item_qty': cartItemQty,
                    'form_key': window.FORM_KEY
                })
            })
                .then(response => response.json())
                .then(data => {
                    Alpine.store('LocalStorage').refresh('cart,messages', true);

                    Alpine.store('Message').addNoticeMessage(ALPINE_MINICART_MESSAGE_UPDATED_QTY);

                    this.loading = false;
                })
            ;
        },
        hasCartItems() {
            if (!this.cart || !this.cart.items) {
                return false;
            }

            return this.cart.items.length > 0;
        },
        hasNoCartItems() {
            return !this.hasCartItems();
        },
        removeCartItem() {
            const cartItemId = this.$el.getAttribute('data-cart-item');

            const ajaxUpdateUrl = ALPINE_MINICART_REMOVE_CART_ITEM_URL;

            this.loading = true;
            fetch(ajaxUpdateUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                body: new URLSearchParams({
                    'item_id': cartItemId,
                    'form_key': window.FORM_KEY
                })
            })
                .then(response => response.json())
                .then(data => {
                    Alpine.store('LocalStorage').refresh('cart,messages', true);
                    Alpine.store('Message').addNoticeMessage(ALPINE_MINICART_MESSAGE_REMOVED_ITEM);
                    this.loading = false;
                });
        }
    }));
});
