import PLANS_PRICING from '../constants/plans'

export default {
  methods: {
    simpleEstimateCalculation() {
      if (!this.selectedPlan.plan) return;

      const plan = this.selectedPlan.plan;
      const prolongMonths = parseInt(this.selectedPlan.prolongMonths || 1, 10);
      const profilesCount = parseInt(this.selectedPlan.profilesCount || 0, 10)
      const additionalUsers = parseInt(this.selectedPlan.additionalUsers || 0, 10);
      const additionalProfiles = parseInt(this.selectedPlan.additionalProfiles || 0, 10);
      const discount = parseInt(this.selectedPlan.discount || 0, 10);
      const paymentMethod = this.selectedPlan.paymentMethod;

      let additionalUsersCost = 0;
      let additionalProfileCost = 0;

      const planPrice = PLANS_PRICING[plan].price

      // [for free] additional ten profiles
      if (['free'].indexOf(plan) > -1) {
        additionalProfileCost = Math.ceil((profilesCount -10) / 10) * PLANS_PRICING[plan].additionalTenProfiles
      }

      // [for enterprice] additional thousand profiles
      if (['enterprise'].indexOf(plan) > -1) {
        additionalProfileCost = Math.ceil((profilesCount - 1000) / 1000) * PLANS_PRICING[plan].additionalThousandProfiles
      }

      // additional users
      if (['base', 'team', 'enterprise'].indexOf(plan) > -1) {
        // calculate
        additionalUsersCost = additionalUsers * PLANS_PRICING[plan].additionalUser
      }

      if(this.profile.subscription.plan === 'trial' && plan === 'free') {
        additionalProfileCost =  Math.ceil(additionalProfiles / 10) * PLANS_PRICING[plan].additionalTenProfiles
      }
      let total = (planPrice + additionalUsersCost + additionalProfileCost) * prolongMonths

      if (discount > 0) {
        total = total - total * (discount/100)
      }
      switch (paymentMethod) {
      case 'card':
        total = total + total * 0.03
        break;
      case 'crypto':
        total = total + total * 0.05
        break;
      case 'capitalist':
        total = total + total * 0.05
        break;
      }
      this.estimate = total
    }
  }
}