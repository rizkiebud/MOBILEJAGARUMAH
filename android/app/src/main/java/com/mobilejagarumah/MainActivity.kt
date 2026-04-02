package com.mobilejagarumah

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

    /**
     * Nama komponen utama yang terdaftar di AppRegistry React Native.
     * Harus sama dengan nama di index.js: AppRegistry.registerComponent('MobileJagarUmah', ...)
     */
    override fun getMainComponentName(): String = "MobileJagarUmah"

    /**
     * DefaultReactActivityDelegate menangani New Architecture (Fabric) secara otomatis.
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
