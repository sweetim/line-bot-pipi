import liff, { Liff } from "@line/liff"
import { useEffect, useState } from "react"

const LIDD_ID = "2006611044-bW7zLloX"

function App() {
  const [ profile, setProfile ] = useState<Awaited<ReturnType<typeof liff.getProfile>>>()
  const [ liffObject, setLiffObject ] = useState<Liff | null>(null)

  useEffect(() => {
    ;(async () => {
      await liff.init({
        liffId: LIDD_ID,
      })

      setLiffObject(liff)

      setProfile(await liff.getProfile())
    })()
  }, [])

  async function loginClickHandler() {
    if (!liffObject) return

    if (!liffObject.isLoggedIn()) {
      liffObject.login()
    }
  }

  async function logoutClickHandler() {
    if (!liffObject) return

    liffObject.logout()
  }

  async function getClickHandler() {
    if (!liffObject) return

    console.log(liffObject.getAppLanguage())
    console.log(liffObject.getVersion())
    console.log(liffObject.isInClient())
    console.log(liffObject.isLoggedIn())
    console.log(liffObject.getOS())
    console.log(liffObject.getLineVersion())
    console.log(await liffObject.getProfile())

    const accessToken = liffObject.getAccessToken()
    console.log(accessToken)

    const idToken = liffObject.getDecodedIDToken()
    console.log(idToken)
  }

  async function connectClickHandler() {
    console.log(liff.isApiAvailable("shareTargetPicker"))
    liff.shareTargetPicker([
      {
        type: "text",
        text: `Connect with your partner - https://liff.line.me/2006611044-bW7zLloX?id=${profile?.userId}`,
      },
    ], {
      isMultiple: false,
    })
    if (liff.isApiAvailable("shareTargetPicker")) {
    }
  }


  return (
    <div className="w-full h-[100vdh]">
      <div className="flex flex-col justify-center items-center">
        <img className="w-64" src="couple.png" />
      </div>
      <div className="flex flex-row justify-center items-center gap-[-1px]">
        <div className="flex flex-col justify-center items-center">
          <img src={profile?.pictureUrl} className="w-32 h-32 rounded-full" />
          <h2>{profile?.displayName}</h2>
        </div>
        <div className="flex flex-col justify-center items-center">
          <img src={profile?.pictureUrl} className="w-32 h-32 rounded-full" />
          <h2>{profile?.displayName}</h2>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2">
        <button className="bg-[#fb6f92] text-white p-3 rounded-full" onClick={connectClickHandler}>CONNECT</button>
        <button className="bg-[#fb6f92] text-white p-3 rounded-full" onClick={loginClickHandler}>Login</button>
        <button className="bg-[#fb6f92] text-white p-3 rounded-full" onClick={logoutClickHandler}>Logout</button>
        <button className="bg-[#fb6f92] text-white p-3 rounded-full" onClick={getClickHandler}>Get</button>
      </div>
    </div>
  )
}

export default App
