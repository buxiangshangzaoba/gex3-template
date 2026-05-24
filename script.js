new Vue({
    el: '#app',
    data: {
        form: {
            fullName: '',
            dob: '',
            gender: '',
            totalVisitors: '',
            childrenCount: '',
            accommodation: '',
            cardHolder: '',
            cardNumber: '',
            expiryDate: '',
            cvv: ''
        },
        errors: {},
        generalError: '',
        places: [],
        isLoadingPlaces: false,
        placesError: '',
        selectedPlaces: [],
        accommodationOptions: [
            'No accommodation needed',
            'Forest View Hotel',
            'Totoro Family Inn',
            'Witch Valley Guesthouse',
            'Luxury Ghibli Resort'
        ],
        showSummary: false
    },
    mounted() {
        this.loadPlaces();
    },
    methods: {
        async loadPlaces() {
            this.isLoadingPlaces = true;
            try {
                const res = await fetch('ghibli_park.json');
                if (!res.ok) throw new Error('Failed to load');
                this.places = await res.json();
            } catch (err) {
                this.placesError = 'Could not load park areas';
            } finally {
                this.isLoadingPlaces = false;
            }
        },
        isPlaceSelected(id) {
            return this.selectedPlaces.some(p => p.id === id);
        },
        togglePlace(place) {
            const index = this.selectedPlaces.findIndex(p => p.id === place.id);
            if (index >= 0) {
                this.selectedPlaces.splice(index, 1);
            } else {
                this.selectedPlaces.push(place);
            }
        },
        truncateDesc(desc) {
            return desc.length > 45 ? desc.substring(0, 45) + '...' : desc;
        },
        validateForm() {
            this.errors = {};
            this.generalError = '';
            let valid = true;

            if (!this.form.fullName) { this.errors.fullName = 'Full name is required'; valid = false; }
            if (!this.form.dob) { this.errors.dob = 'Date of birth is required'; valid = false; }
            if (!this.form.gender) { this.errors.gender = 'Please select your gender'; valid = false; }
            if (this.selectedPlaces.length === 0) { this.errors.selectedPlaces = 'Please select at least one park area'; valid = false; }
            if (!this.form.totalVisitors || this.form.totalVisitors < 1) { this.errors.totalVisitors = 'At least 1 visitor is required'; valid = false; }
            if (this.form.childrenCount < 0) { this.errors.childrenCount = 'Children count cannot be negative'; valid = false; }
            if (!this.form.accommodation) { this.errors.accommodation = 'Please select accommodation'; valid = false; }
            if (!this.form.cardHolder) { this.errors.cardHolder = 'Cardholder name is required'; valid = false; }
            if (!this.form.cardNumber) { this.errors.cardNumber = 'Card number is required'; valid = false; }
            if (!this.form.expiryDate) { this.errors.expiryDate = 'Expiry date is required'; valid = false; }
            if (!this.form.cvv) { this.errors.cvv = 'CVV is required'; valid = false; }

            if (!valid) {
                this.generalError = 'There are mandatory items pending to be filled. Please complete the required fields.';
            }
            return valid;
        },
        generateItinerary() {
            if (this.validateForm()) {
                this.showSummary = true;
            }
        }
    }
});