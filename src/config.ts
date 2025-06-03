process.loadEnvFile()

function envOrThrow(key: string) {
    const value = process.env[key]
    if (!value) {
      throw new Error("env value not found")
    }
  
    return value
  }

  type Config = {
    api:APIConfig
  }


  type APIConfig = {
    port:number
    platform:string
  }
  

  export const config:Config = {
    api:{
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM")
    }
  }