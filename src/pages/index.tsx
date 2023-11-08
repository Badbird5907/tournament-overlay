import { Button, Card, Input } from "@mui/joy";
import { useState } from "react";
import CustomButton from "@/components/button";
import axios from "axios";

export default function Home() {
  const [password, setPassword] = useState<string>("");
  return (
    <div
      className={
        "admin-bg min-h-screen flex flex-col items-center justify-center"
      }
    >
      <Card>
        <h1 className={"text-4xl font-bold text-center"}>Tournament Manager</h1>
        <h1 className={"text-2xl font-bold text-center"}>Login</h1>
        <Input
          type={"password"}
          placeholder={"Password"}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />
        <CustomButton
          variant={"outlined"}
          onClickLoading={() => {
            // axios post /api/auth/signin {token}
            return axios
              .post("/api/auth/signin", { token: password })
              .then((res) => {
                console.log(res);
                if (res.status === 200) {
                  window.location.href = "/admin";
                }
              });
          }}
        >
          Submit
        </CustomButton>
      </Card>
    </div>
  );
}
