import useAdmin from "@/hooks/useAdmin";
import useLogin from "@/hooks/useLogin";
import { Login, Logout, Register } from "@/wailsjs/go/main/App";
import { WindowReloadApp } from "@/wailsjs/runtime/runtime";
import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import z from "zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export function SignedIn({ children }: { children?: React.ReactElement }) {
  // check login
  const { loggedIn } = useLogin();

  if (loggedIn) return <div>{children}</div>;
  return <></>;
}

export function AdminPage({ children }: { children?: React.ReactElement }) {
  // check login
  const { loggedIn } = useLogin();
  const admin = useAdmin();

  if (loggedIn && admin) return <div>{children}</div>;
  return <></>;
}

export function SignedOut({ children }: { children?: React.ReactElement }) {
  const { loggedIn } = useLogin();

  if (!loggedIn) return <div>{children}</div>;
  return <></>;
}

const signInFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const signUpFormSchema = z
  .object({
    username: z
      .string()
      .min(3, {
        message: "Der Benutzername muss mindestens 3 Zeichen lang sein",
      })
      .max(100, {
        message: "Der Benutzername darf nicht länger als 20 Zeichen sein",
      }),
    mail: z
      .email()
      .refine((mail) => mail.includes("@computer-extra.de"), {
        message: "Bitte die Firmen E-Mail nutzen",
      })
      .refine((mail) => mail.split("@")[0].length >= 2, {
        message: "Bitte die komplette Firmen E-Mail nutzen, keinen Alias.",
      }),
    password: z
      .string()
      .min(8, { message: "Das Passwort muss mindestens 8 Zeichen lang sein" })
      .max(20, { message: "Das Passwort darf maximal 20 Zeichen lang sein" })
      .refine((password) => /[a-z]/.test(password), {
        message: "Das Passwort muss Kleinbuchstaben enthalten",
      })
      .refine((password) => /[A-Z]/.test(password), {
        message: "Das Passwort muss Großbuchstaben enthalten",
      })
      .refine((password) => /[0-9]/.test(password), {
        message: "Das Passwort muss Zahlen enthalten",
      })
      .refine((password) => /[!@#$%^&?*]/.test(password), {
        message: "Das Passwort muss Sonderzeichen enthalten",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Die eingegebenen Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

export function SignInButton() {
  const [showSignUp, setShowSignUp] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>LogIn</Button>
      </DialogTrigger>
      {showSignUp ? (
        <SignUp setShow={setShowSignUp} />
      ) : (
        <SignIn setShow={setShowSignUp} />
      )}
    </Dialog>
  );
}

export function SignOutButton() {
  const admin = useAdmin();
  const { user } = useLogin();
  const handleLogout = async () => {
    const res = await Logout();
    if (res) {
      WindowReloadApp();
    }
  };
  return (
    <div className="panel print:hidden">
      <div className="panel-label">Account</div>
      <div className="p-1">
        <div className="flex w-full justify-between">
          <div className="grid items-center ps-8">
            <span>Angemeldet als: {user?.username}</span>
            <span>Mail: {user?.mail}</span>
            <span>Berechtigungen: {admin ? "Administrator" : "Benutzer"}</span>
          </div>
          <div className="grid ps-8 gap-2">
            <Button variant={"outline"} asChild>
              <Link to="/Profile">Mein Profil</Link>
            </Button>
            <Button variant={"outline"} onClick={handleLogout}>
              Abmelden
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignIn({
  setShow,
}: {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
    const res = await Login(values.username, values.password);
    if (res) {
      WindowReloadApp();
    }
  };

  return (
    <DialogContent className="dark">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Anmelden</DialogTitle>
            <DialogDescription>
              Noch keinen Account? -{" "}
              <span
                className="underline cursor-pointer"
                onClick={() => setShow((prev) => !prev)}
              >
                Hier
              </span>{" "}
              kann ein neuer Erstellt werden.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-3">
                    <FormLabel>Benutzername</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-3">
                    <FormLabel>Passwort</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>Abbrechen</Button>
            </DialogClose>
            <Button type="submit">Anmelden</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

function SignUp({
  setShow,
}: {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
  });

  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    const res = await Register(values.mail, values.username, values.password);
    if (res) {
      alert("Konto erfolgreich erstellt.");
      WindowReloadApp();
    }
  };

  return (
    <DialogContent className="dark">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Registrieren</DialogTitle>
            <DialogDescription>
              Gibt es bereits einen Account? -{" "}
              <span
                className="underline cursor-pointer"
                onClick={() => setShow((prev) => !prev)}
              >
                Hier
              </span>{" "}
              Anmelden.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-3">
                    <FormLabel>Benutzername</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-3">
                    <FormLabel>E-Mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="max@muster.de"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-3">
                    <FormLabel>Passwort</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="grid gap-3">
                    <FormLabel>Passwort wiederholen</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>Abbrechen</Button>
            </DialogClose>
            <Button type="submit">Registrieren</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
