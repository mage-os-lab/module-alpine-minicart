<?php
declare(strict_types=1);

namespace MageOS\AlpineMinicart\ViewModel;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;

class Minicart implements ArgumentInterface
{
    public function __construct(
        private ScopeConfigInterface $scopeConfig,
    ) {
    }

    public function count()
    {
        return (int)$this->scopeConfig->getValue('checkout/sidebar/count');
    }

    public function maxItemsDisplayCount()
    {
        return (int)$this->scopeConfig->getValue('checkout/sidebar/max_items_display_count');
    }
}
